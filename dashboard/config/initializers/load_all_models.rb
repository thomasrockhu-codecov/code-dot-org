# load all the model classes on startup to avoid problems with Marshal.load
# egrep -r '^class' app/models | cut -d' ' -f2 | ruby -pe '$_ = $_.strip + ",\n"'
if Dashboard::Application.config.eager_load
  [
    Ability,
    Activity,
    ActivitySection,
    Ailab,
    Applab,
    ApplicationRecord,
    Artist,
    AssessmentActivity,
    AuthenticationOption,
    AuthoredHintViewRequest,
    Backpack,
    Block,
    Blockly,
    Bounce,
    BubbleChoice,
    Calc,
    Callout,
    Census::ApCsOffering,
    Census::ApSchoolCode,
    Census::CensusHoc2017v1,
    Census::CensusHoc2017v2,
    Census::CensusHoc2017v3,
    Census::CensusInaccuracyInvestigation,
    Census::CensusOverride,
    Census::CensusSubmission,
    Census::CensusSubmissionFormMap,
    Census::CensusSummary,
    Census::CensusTeacherBannerV1,
    Census::CensusYourSchool2017v0,
    Census::CensusYourSchool2017v1,
    Census::CensusYourSchool2017v2,
    Census::CensusYourSchool2017v3,
    Census::CensusYourSchool2017v4,
    Census::CensusYourSchool2017v5,
    Census::CensusYourSchool2017v6,
    Census::CensusYourSchool2017v7,
    Census::IbCsOffering,
    Census::IbSchoolCode,
    Census::OtherCurriculumOffering,
    Census::StateCsOffering,
    ChannelToken,
    CircuitPlaygroundDiscountApplication,
    CircuitPlaygroundDiscountCode,
    CleverSection,
    CodeReviewComment,
    CodeReviewGroup,
    CodeReviewGroupMember,
    Concept,
    ContactRollupsFinal,
    ContactRollupsPardotMemory,
    ContactRollupsProcessed,
    ContactRollupsRaw,
    ContractMatch,
    CourseOffering,
    CourseVersion,
    Craft,
    CurriculumReference,
    DSLDefined,
    Dancelab,
    DeletedUser,
    Donor,
    DonorSchool,
    EmailPreference,
    EmailSection,
    Eval,
    EvaluationMulti,
    Experiment,
    External,
    ExternalLink,
    FeaturedProject,
    Fish,
    Flappy,
    Follower,
    Foorm::Form,
    Foorm::Library,
    Foorm::LibraryQuestion,
    Foorm::SimpleSurveyForm,
    Foorm::SimpleSurveySubmission,
    Foorm::Submission,
    Framework,
    FreeResponse,
    FrequencyAnalysis,
    Game,
    Gamelab,
    GamelabJr,
    GoogleClassroomSection,
    Grid,
    HintViewRequest,
    Javalab,
    Karel,
    Lesson,
    LessonActivity,
    LessonGroup,
    LessonsOpportunityStandard,
    LessonsProgrammingExpression,
    LessonsResource,
    LessonsStandard,
    LessonsVocabulary,
    Level,
    LevelConceptDifficulty,
    LevelGroup,
    LevelSource,
    LevelSourceImage,
    LevelsScriptLevel,
    Library,
    Map,
    Match,
    Maze,
    Metric,
    Multi,
    NetSim,
    Objective,
    Odometer,
    OmniAuthSection,
    OverflowActivity,
    PairedUserLevel,
    ParentLevelsChildLevel,
    Pd::Attendance,
    Pd::CourseFacilitator,
    Pd::DistrictPaymentTerm,
    Pd::Enrollment,
    Pd::EnrollmentNotification,
    Pd::FacilitatorProgramRegistration,
    Pd::FacilitatorTeacherconAttendance,
    Pd::FitWeekend1819Registration,
    Pd::FitWeekend1920Registration,
    Pd::FitWeekendRegistrationBase,
    Pd::InternationalOptIn,
    Pd::LegacySurveySummary,
    Pd::LocalSummerWorkshopSurvey,
    Pd::PaymentTerm,
    Pd::PreWorkshopSurvey,
    Pd::RegionalPartnerCohort,
    Pd::RegionalPartnerContact,
    Pd::RegionalPartnerMapping,
    Pd::RegionalPartnerMiniContact,
    Pd::RegionalPartnerProgramRegistration,
    Pd::ScholarshipInfo,
    Pd::Session,
    Pd::Teachercon1819Registration,
    Pd::TeacherconSurvey,
    Pd::Workshop,
    Pd::WorkshopSurvey,
    Pd::WorkshopSurveyFoormSubmission,
    PeerReview,
    PictureSection,
    Pilot,
    Pixelation,
    Plc::Course,
    Plc::CourseUnit,
    Plc::EnrollmentModuleAssignment,
    Plc::EnrollmentUnitAssignment,
    Plc::LearningModule,
    Plc::UserCourseEnrollment,
    Poetry,
    ProgrammingEnvironment,
    ProgrammingExpression,
    ProjectVersion,
    PublicKeyCryptography,
    PuzzleRating,
    QueuedAccountPurge,
    RegionalPartner,
    RegionalPartnerProgramManager,
    RegionalPartnersSchoolDistrict,
    Resource,
    ReviewableProject,
    School,
    SchoolDistrict,
    SchoolInfo,
    SchoolStatsByYear,
    Script,
    ScriptLevel,
    ScriptsResource,
    ScriptsStudentResource,
    SecretPicture,
    SecretWord,
    Section,
    SectionHiddenLesson,
    SectionHiddenScript,
    SeededS3Object,
    SharedBlocklyFunction,
    SignIn,
    SingleSectionExperiment,
    SingleUserExperiment,
    StandaloneVideo,
    Standard,
    StandardCategory,
    StarWarsGrid,
    Studio,
    StudioEC,
    StudioPerson,
    SurveyResult,
    TTSSafe,
    TeacherBasedExperiment,
    TeacherFeedback,
    TeacherProfile,
    TeacherScore,
    TextCompression,
    TextMatch,
    UnitGroup,
    UnitGroupUnit,
    UnitGroupsResource,
    UnitGroupsStudentResource,
    Unplugged,
    User,
    UserBasedExperiment,
    UserGeo,
    UserLevel,
    UserMlModel,
    UserPermission,
    UserProficiency,
    UserSchoolInfo,
    UserScript,
    Video,
    Vigenere,
    Vocabulary,
    Weblab,
    Widget,
    WordSection
  ].each do |klass|
    klass.new
  rescue NotImplementedError, ArgumentError, ActiveModel::MissingAttributeError, ActiveRecord::StatementInvalid, NoMethodError
    # we don't actually care whether or not we're able to successfully
    # initialize a model (many of our model classes are abstract and cannot be
    # initialized, or have validation requirements that prevent them from being
    # initialized as "empty"); all we care about here is that we *try* to
    # initialize a model, so we can guarantee that model class has been loaded
  end
end
