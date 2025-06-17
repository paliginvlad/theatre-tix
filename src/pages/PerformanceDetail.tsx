import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPerformanceById, addCommentToPerformance, getAverageRating, Comment, fetchComments, postComment, updateComment, deleteComment } from "@/services/performanceService";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, Star, MessageSquare, Ticket, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PerformanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const performance = id ? getPerformanceById(id) : undefined;
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  React.useEffect(() => {
    if (id) {
      setLoadingComments(true);
      fetchComments(id)
        .then(data => {
          if (Array.isArray(data)) {
            setComments(data);
          } else {
            setComments([]);
          }
        })
        .finally(() => setLoadingComments(false));
    }
  }, [id]);

  if (!performance) {
    return <Navigate to="/not-found" />;
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ua' ? 'uk-UA' : undefined, options);
  };
  
  const handleSubmitComment = async () => {
    if (!isAuthenticated || !currentUser) {
      alert("Please log in to leave a comment");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    const newComment = {
      performance_id: performance.id,
      user_id: currentUser.id,
      user_name: `${currentUser.firstName} ${currentUser.lastName}`,
      text: comment,
      rating,
      date: new Date().toISOString().split("T")[0],
    };
    await postComment(newComment);
    setComment("");
    setRating(5);
    fetchComments(performance.id).then(setComments);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
    setEditRating(comment.rating);
  };

  const handleSaveEdit = async (id: string) => {
    await updateComment(Number(id), { text: editText, rating: editRating });
    setEditingCommentId(null);
    fetchComments(performance.id).then(setComments);
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm(t("performance.reviews.deleteConfirm") || "Delete comment?")) {
      await deleteComment(Number(id));
      fetchComments(performance.id).then(setComments);
    }
  };

  const averageRating = getAverageRating(performance);
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? "#D4AF37" : "none"}
            stroke="#D4AF37"
            className="mr-1"
          />
        ))}
      </div>
    );
  };
  
  const renderRatingStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            fill={star <= (hoveredRating || rating) ? "#D4AF37" : "none"}
            stroke="#D4AF37"
            className="cursor-pointer mr-1"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  // Get translated performance details based on language
  const translatedName = language === 'ua' ? 
    getUkrainianPerformanceName(performance.name) : performance.name;
  
  const translatedDescription = language === 'ua' ? 
    getUkrainianDescription(performance.name) : performance.description;
  
  const translatedDirector = language === 'ua' ? 
    getUkrainianDirectorName(performance.director) : performance.director;
  
  const translatedActors = language === 'ua' ? 
    performance.actors.map(actor => getUkrainianActorName(actor)) : performance.actors;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px]">
          <div className="absolute inset-0 bg-theatre-black">
            <img
              src={performance.mainImage}
              alt={translatedName}
              className="w-full h-full object-cover opacity-70"
            />
          </div>
          
          <div className="relative h-full theatre-container flex flex-col justify-end pb-12 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{translatedName}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2 text-theatre-gold" />
                  <span>{formatDate(performance.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="mr-2 text-theatre-gold" />
                  <span>{performance.startTime} - {performance.endTime}</span>
                </div>
                <div className="flex items-center">
                  <Star size={20} className="mr-2 text-theatre-gold" fill="#D4AF37" />
                  <span>{averageRating} / 5</span>
                  <span className="ml-1 text-gray-300">({performance.ratings.length} {t("performance.reviews")})</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Action Button */}
        <div className="theatre-container">
          <div className="relative -mt-8 z-10 flex justify-end">
            <Link to={`/tickets/${performance.id}`}>
              <Button size="lg" className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white px-8 py-6">
                <Ticket className="mr-2" />
                {t("performance.buyTickets")}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Performance Details */}
        <section className="py-12">
          <div className="theatre-container">
            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about">{t("performance.about")}</TabsTrigger>
                <TabsTrigger value="cast">{t("performance.cast")}</TabsTrigger>
                <TabsTrigger value="gallery">{t("performance.gallery")}</TabsTrigger>
                <TabsTrigger value="reviews">{t("performance.reviews")}</TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="about" className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">{t("performance.about.title")}</h2>
                      <p className="text-gray-700 whitespace-pre-line">
                        {translatedDescription}
                      </p>
                      
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">{t("performance.info")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">{t("performance.info.date")}</p>
                            <p className="text-gray-600">{formatDate(performance.date)}</p>
                          </div>
                          <div>
                            <p className="font-medium">{t("performance.info.time")}</p>
                            <p className="text-gray-600">{performance.startTime} - {performance.endTime}</p>
                          </div>
                          <div>
                            <p className="font-medium">{t("performance.info.director")}</p>
                            <p className="text-gray-600">{translatedDirector}</p>
                          </div>
                          <div>
                            <p className="font-medium">{t("performance.info.duration")}</p>
                            <p className="text-gray-600">{t("performance.info.durationText")}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="cast" className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">{t("performance.cast.title")}</h2>
                      
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">{t("performance.cast.director")}</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="font-medium text-theatre-burgundy text-lg">{translatedDirector}</p>
                          <p className="text-gray-600 mt-2">
                            {language === 'ua' ? 
                              "Відомий своїм вмінням втілювати класичні п'єси в сучасних інтерпретаціях, " + 
                              translatedDirector + " поставив численні вистави, що отримали нагороди." :
                              "Renowned for bringing classic plays to life with modern interpretations, " +
                              performance.director + " has directed numerous award-winning productions."}
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">{t("performance.cast.actors")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {translatedActors.map((actor, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <p className="font-medium text-theatre-burgundy">{language === 'ua' ? 
                                (index === 0 ? "Головна роль" : `Роль другого плану ${index}`) : 
                                (index === 0 ? "Lead Role" : `Supporting Role ${index}`)}</p>
                            <p className="text-gray-600 mt-1">
                                {actor}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-semibold mt-8 mb-4">{t("performance.cast.creative")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                          <p className="font-medium text-theatre-burgundy">{t("performance.cast.setDesign")}</p>
                          <p className="text-gray-600 mt-1">{language === 'ua' ? "Олена Томпсон" : "Elena Thompson"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                          <p className="font-medium text-theatre-burgundy">{t("performance.cast.costumeDesign")}</p>
                          <p className="text-gray-600 mt-1">{language === 'ua' ? "Маркус Рейнольдс" : "Marcus Reynolds"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                          <p className="font-medium text-theatre-burgundy">{t("performance.cast.lightingDesign")}</p>
                          <p className="text-gray-600 mt-1">{language === 'ua' ? "Джесіка Кім" : "Jessica Kim"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                          <p className="font-medium text-theatre-burgundy">{t("performance.cast.soundDesign")}</p>
                          <p className="text-gray-600 mt-1">{language === 'ua' ? "Роберт Чен" : "Robert Chen"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                          <p className="font-medium text-theatre-burgundy">{t("performance.cast.choreography")}</p>
                          <p className="text-gray-600 mt-1">{language === 'ua' ? "Софія Мартінез" : "Sophia Martinez"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="gallery">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">{t("performance.gallery.title")}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {performance.images.map((image, index) => (
                          <div key={index} className="overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow">
                            <img 
                              src={image} 
                              alt={`${translatedName} - ${language === 'ua' ? 'Зображення' : 'Image'} ${index + 1}`}
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">{t("performance.reviews.title")}</h2>
                        <div className="flex items-center">
                          <Star size={20} className="mr-1 text-theatre-gold" fill="#D4AF37" />
                          <span className="font-semibold">{averageRating}</span>
                          <span className="text-gray-500 ml-1">/ 5</span>
                          <span className="text-gray-500 ml-1">({performance.ratings.length} {t("performance.reviews")})</span>
                        </div>
                      </div>
                      
                      {isAuthenticated ? (
                        <div className="bg-gray-50 p-4 rounded-md mb-8">
                          <h3 className="text-lg font-semibold mb-2">{t("performance.reviews.writeReview")}</h3>
                          <div className="mb-4">
                            <p className="mb-2">{t("performance.reviews.yourRating")}</p>
                            {renderRatingStars()}
                          </div>
                          <div className="mb-4">
                            <label htmlFor="comment" className="block mb-2">{t("performance.reviews.yourComment")}</label>
                            <Textarea
                              id="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder={t("performance.reviews.commentPlaceholder")}
                              className="w-full h-24"
                            />
                          </div>
                          <Button 
                            onClick={handleSubmitComment}
                            className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t("performance.reviews.submit")}
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md mb-8 text-center">
                          <p className="mb-2">{t("performance.reviews.loginToReview")}</p>
                          <Link to="/login">
                            <Button className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white">
                              {t("performance.reviews.loginButton")}
                            </Button>
                          </Link>
                        </div>
                      )}
                      
                      {loadingComments ? (
                        <div className="text-center py-8">Loading...</div>
                      ) : Array.isArray(comments) && comments.length > 0 ? (
                        <div className="space-y-6">
                          {comments.map((comment: Comment) => (
                            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0 relative">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{(comment as any).user_name || comment.userName}</p>
                                  <p className="text-sm text-gray-500">{formatDate(comment.date)}</p>
                                </div>
                                {renderStars(comment.rating)}
                              </div>
                              {editingCommentId === comment.id ? (
                                <div>
                                  <Textarea
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    className="w-full h-20 mb-2"
                                  />
                                  <div className="flex items-center mb-2">
                                    {[1,2,3,4,5].map(star => (
                                      <Star
                                        key={star}
                                        size={20}
                                        fill={star <= editRating ? "#D4AF37" : "none"}
                                        stroke="#D4AF37"
                                        className="cursor-pointer mr-1"
                                        onClick={() => setEditRating(star)}
                                      />
                                    ))}
                                  </div>
                                  <Button size="sm" className="mr-2" onClick={() => handleSaveEdit(comment.id)}>{t("performance.reviews.save")}</Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>{t("performance.reviews.cancel")}</Button>
                                </div>
                              ) : (
                                <p className="text-gray-700">{comment.text}</p>
                              )}
                              {/* Edit/Delete icons */}
                              {isAuthenticated && (currentUser?.id === comment.userId || isAdmin) && (
                                <div className="absolute right-2 bottom-2 flex gap-2">
                                  <button onClick={() => handleEditComment(comment)} title={t("performance.reviews.edit") || "Edit"}>
                                    <Pencil size={18} className="text-theatre-gold hover:text-theatre-burgundy" />
                                  </button>
                                  <button onClick={() => handleDeleteComment(comment.id)} title={t("performance.reviews.delete") || "Delete"}>
                                    <Trash2 size={18} className="text-red-500 hover:text-red-700" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium">{t("performance.reviews.empty.title")}</h3>
                          <p className="mt-1 text-gray-500">{t("performance.reviews.empty.subtitle")}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper functions for Ukrainian translations

function getUkrainianPerformanceName(name: string): string {
  switch (name) {
    case "Hamlet":
      return "Гамлет";
    case "Romeo and Juliet":
      return "Ромео і Джульєтта";
    case "Macbeth":
      return "Макбет";
    case "The Tempest":
      return "Буря";
    case "A Midsummer Night's Dream":
      return "Сон літньої ночі";
    default:
      return name;
  }
}

function getUkrainianDescription(name: string): string {
  switch (name) {
    case "Hamlet":
      return "Трагедія «Гамлет, принц Данський» — трагедія Вільяма Шекспіра, написана між 1599 та 1602 роками. Дія відбувається в Данії, п'єса зображує принца Гамлета та його помсту своєму дядьку Клавдію, який вбив Гамлетового батька, щоб захопити його трон і одружитися з Гамлетовою матір'ю.";
    case "Romeo and Juliet":
      return "«Ромео і Джульєтта» — трагедія, написана Вільямом Шекспіром на початку його кар'єри, про двох молодих італійських закоханих із ворожих сімей, чиї смерті зрештою примирюють їхні ворогуючі родини.";
    case "Macbeth":
      return "«Макбет» — трагедія Вільяма Шекспіра; вважається, що вона вперше була поставлена в 1606 році. Вона драматизує руйнівні фізичні та психологічні наслідки політичних амбіцій для тих, хто прагне влади заради самої влади.";
    case "The Tempest":
      return "«Буря» — п'єса Вільяма Шекспіра, ймовірно написана в 1610–1611 роках, і вважається однією з останніх п'єс, які Шекспір написав сам. Після першої сцени, яка відбувається на кораблі в морі під час бурі, решта історії відбувається на віддаленому острові, де чаклун Просперо, складний і суперечливий персонаж, живе зі своєю дочкою Мірандою та двома своїми слугами — Калібаном, диким монстром, і Аріелем, повітряним духом.";
    case "A Midsummer Night's Dream":
      return "«Сон літньої ночі» — комедія, написана Вільямом Шекспіром у 1595/96. Вона зображує події навколо одруження Тесея, герцога Афінського, з Іпполітою, колишньою царицею амазонок.";
    default:
      return "";
  }
}

function getUkrainianDirectorName(director: string): string {
  switch (director) {
    case "Sarah Johnson":
      return "Сара Джонсон";
    case "Robert Wilson":
      return "Роберт Вілсон";
    case "David Thompson":
      return "Девід Томпсон";
    case "Elizabeth Roberts":
      return "Єлизавета Робертс";
    case "Andrew Peterson":
      return "Андрій Петерсон";
    default:
      return director;
  }
}

function getUkrainianActorName(actor: string): string {
  switch (actor) {
    case "Michael Stone":
      return "Михайло Стоун";
    case "Emma Williams":
      return "Емма Вільямс";
    case "Daniel Brown":
      return "Даніель Браун";
    case "Sophia Lee":
      return "Софія Лі";
    case "James Parker":
      return "Джеймс Паркер";
    case "Olivia Smith":
      return "Олівія Сміт";
    case "Thomas Miller":
      return "Томас Міллер";
    case "Isabella Johnson":
      return "Ізабелла Джонсон";
    case "William Clark":
      return "Вільям Кларк";
    case "Charlotte White":
      return "Шарлотта Вайт";
    case "Henry Davis":
      return "Генрі Девіс";
    case "Grace Taylor":
      return "Грейс Тейлор";
    case "Richard Morgan":
      return "Річард Морган";
    case "Jennifer Adams":
      return "Дженніфер Адамс";
    case "Matthew Wilson":
      return "Матвій Вілсон";
    case "Emily Harris":
      return "Емілі Гарріс";
    case "Samuel Green":
      return "Самуїл Грін";
    case "Natalie Turner":
      return "Наталі Тернер";
    case "Christopher Lewis":
      return "Крістофер Льюїс";
    case "Victoria Moore":
      return "Вікторія Мур";
    default:
      return actor;
  }
}

export default PerformanceDetail;
