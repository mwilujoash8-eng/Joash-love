import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { Header } from './components/common/Header';
import { DeviceSwitcherBanner } from './components/common/DeviceSwitcherBanner';
import { MobileTopBar } from './components/mobile/MobileTopBar';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileQuickActionSheet } from './components/mobile/MobileQuickActionSheet';
import { MobileExcelView } from './components/mobile/MobileExcelView';
import { SchoolPublicWebsite } from './components/website/SchoolPublicWebsite';
import { LoginPage } from './components/common/LoginPage';
import { HeadTeacherDashboard } from './components/dashboards/HeadTeacherDashboard';
import { DeputyHeadDashboard } from './components/dashboards/DeputyHeadDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { BoardDashboard } from './components/dashboards/BoardDashboard';
import { PlatformAdminDashboard } from './components/dashboards/PlatformAdminDashboard';
import { SchoolCreationModal } from './components/modals/SchoolCreationModal';
import { UserRegistrationModal } from './components/modals/UserRegistrationModal';
import { SubscriptionModal } from './components/modals/SubscriptionModal';
import { DigitalReportCardModal } from './components/modals/DigitalReportCardModal';
import { AuditLogsModal } from './components/modals/AuditLogsModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { RoleSelectionModal } from './components/common/RoleSelectionModal';
import { PendingVerificationScreen } from './components/common/PendingVerificationScreen';
import { GeminiChatbotStudio } from './components/tools/GeminiChatbotStudio';
import { DailyMasterCodeModal } from './components/modals/DailyMasterCodeModal';
import { GoogleClassroomModal } from './components/modals/GoogleClassroomModal';
import { GoogleMeetModal } from './components/modals/GoogleMeetModal';
import { SchoolModulesModal } from './components/modals/SchoolModulesModal';
import { TermReportCard, UserRole } from './types';
import { Sparkles } from 'lucide-react';

const SchoolLinkAppContent: React.FC = () => {
  const { currentUser, reportCards, isAuthenticated } = useSchool();
  const { isSmartphone } = useDevice();

  // Website View vs Portal Login View when not authenticated
  const [showWebsiteLanding, setShowWebsiteLanding] = useState<boolean>(true);
  const [selectedInitialRole, setSelectedInitialRole] = useState<UserRole | undefined>(undefined);

  // Mobile Active Bottom Navigation Tab
  const [mobileTab, setMobileTab] = useState<string>('overview');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);

  // Modals state
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [isRegisterUserOpen, setIsRegisterUserOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiChatbotOpen, setIsAiChatbotOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isDailyCodeOpen, setIsDailyCodeOpen] = useState(false);
  const [isGoogleClassroomOpen, setIsGoogleClassroomOpen] = useState(false);
  const [isGoogleMeetOpen, setIsGoogleMeetOpen] = useState(false);
  const [isSchoolModulesOpen, setIsSchoolModulesOpen] = useState(false);
  const [activeReportCard, setActiveReportCard] = useState<TermReportCard | null>(null);

  // Daily Master Code and Modals are opened on-demand via header buttons or actions


  const handleOpenReportCard = (reportCardId: string) => {
    const found = reportCards.find((r) => r.id === reportCardId) || reportCards[0];
    setActiveReportCard(found || null);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'quick_add_student') {
      setIsRegisterUserOpen(true);
    } else if (actionId === 'open_excel') {
      setMobileTab('excel_studio');
    } else if (actionId === 'record_attendance') {
      setMobileTab('attendance');
    } else if (actionId === 'view_report_cards') {
      if (reportCards.length > 0) {
        setActiveReportCard(reportCards[0]);
      }
    } else if (actionId === 'post_announcement') {
      setMobileTab('notices');
    } else if (actionId === 'open_ai_assistant') {
      setIsAiChatbotOpen(true);
    }
  };

  // Render Public School Website if active (available to guests and signed-in users)
  if (showWebsiteLanding) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-900 font-sans antialiased">
        <DeviceSwitcherBanner />
        <SchoolPublicWebsite
          onEnterPortal={(role?: UserRole) => {
            if (!isAuthenticated && role) {
              setSelectedInitialRole(role);
            }
            setShowWebsiteLanding(false);
          }}
          onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
          onOpenDailyCode={() => setIsDailyCodeOpen(true)}
        />

        <SchoolCreationModal
          isOpen={isCreateSchoolOpen}
          onClose={() => setIsCreateSchoolOpen(false)}
        />

        <DailyMasterCodeModal
          isOpen={isDailyCodeOpen}
          onClose={() => setIsDailyCodeOpen(false)}
          onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
        />
      </div>
    );
  }

  // If not authenticated and not viewing website, show Login Portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-900 font-sans antialiased">
        <DeviceSwitcherBanner />
        <LoginPage
          onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
          onOpenDailyCodeModal={() => setIsDailyCodeOpen(true)}
          onViewWebsite={() => setShowWebsiteLanding(true)}
          initialRole={selectedInitialRole}
        />

        <SchoolCreationModal
          isOpen={isCreateSchoolOpen}
          onClose={() => setIsCreateSchoolOpen(false)}
        />

        <DailyMasterCodeModal
          isOpen={isDailyCodeOpen}
          onClose={() => setIsDailyCodeOpen(false)}
          onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
        />
      </div>
    );
  }

  const isPending = currentUser?.verificationStatus === 'pending';
  const userRole = currentUser?.role || 'head_teacher';

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white antialiased">
      {/* Universal Device & Viewport Intelligence Bar */}
      <DeviceSwitcherBanner />

      {/* DEDICATED HEADER: SMARTPHONE VS LAPTOP/DESKTOP */}
      {isSmartphone ? (
        <MobileTopBar
          onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
          onOpenRegisterUser={() => setIsRegisterUserOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenGeminiAI={() => setIsAiChatbotOpen(true)}
          onOpenDailyCodeModal={() => setIsDailyCodeOpen(true)}
          onOpenGoogleMeet={() => setIsGoogleMeetOpen(true)}
          onOpenSchoolModules={() => setIsSchoolModulesOpen(true)}
          onViewWebsite={() => setShowWebsiteLanding(true)}
        />
      ) : (
        <Header
          onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
          onOpenRegisterUser={() => setIsRegisterUserOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenGeminiAI={() => setIsAiChatbotOpen(true)}
          onOpenDailyCodeModal={() => setIsDailyCodeOpen(true)}
          onOpenGoogleClassroom={() => setIsGoogleClassroomOpen(true)}
          onOpenGoogleMeet={() => setIsGoogleMeetOpen(true)}
          onOpenSchoolModules={() => setIsSchoolModulesOpen(true)}
          onViewWebsite={() => setShowWebsiteLanding(true)}
        />
      )}

      {/* Main Operating System Canvas */}
      <main
        className={`flex-1 w-full mx-auto ${
          isSmartphone
            ? 'max-w-xl px-3 sm:px-4 py-3 pb-24'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
        }`}
      >
        {isPending ? (
          <PendingVerificationScreen onOpenRoleSwitcher={() => setIsRoleModalOpen(true)} />
        ) : (
          <>
            {/* If Mobile and Excel Studio tab is active */}
            {isSmartphone && mobileTab === 'excel_studio' ? (
              <MobileExcelView />
            ) : (
              <>
                {userRole === 'head_teacher' && (
                  <HeadTeacherDashboard
                    onViewReportCard={handleOpenReportCard}
                    onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                  />
                )}

                {userRole === 'deputy_head_teacher' && (
                  <DeputyHeadDashboard
                    onViewReportCard={handleOpenReportCard}
                    onOpenProfile={() => setIsProfileOpen(true)}
                  />
                )}

                {userRole === 'teacher' && (
                  <TeacherDashboard
                    onViewReportCard={handleOpenReportCard}
                    onOpenProfile={() => setIsProfileOpen(true)}
                  />
                )}

                {userRole === 'student' && (
                  <StudentDashboard
                    onViewReportCard={handleOpenReportCard}
                    onOpenProfile={() => setIsProfileOpen(true)}
                  />
                )}

                {userRole === 'parent' && (
                  <ParentDashboard
                    onViewReportCard={handleOpenReportCard}
                    onOpenRegisterUser={() => setIsRegisterUserOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                  />
                )}

                {userRole === 'school_board' && (
                  <BoardDashboard onOpenProfile={() => setIsProfileOpen(true)} />
                )}

                {userRole === 'platform_admin' && (
                  <PlatformAdminDashboard
                    onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onOpenGoogleMeet={() => setIsGoogleMeetOpen(true)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* DEDICATED SMARTPHONE BOTTOM NAVIGATION & FAB */}
      {isSmartphone && !isPending && (
        <>
          <MobileBottomNav
            activeTab={mobileTab}
            onTabChange={(tab) => setMobileTab(tab)}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
          />

          <MobileQuickActionSheet
            isOpen={isQuickActionOpen}
            onClose={() => setIsQuickActionOpen(false)}
            onSelectAction={handleQuickAction}
          />
        </>
      )}

      {/* Footer (Desktop & Tablet) */}
      {!isSmartphone && (
        <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <strong className="text-slate-800 font-bold">SchoolLink</strong> &bull; Official Digital School Website & Portal &bull; Scalable for Zambian & Regional Education
            </p>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">ECZ Standard Grading</span>
              <span>&bull;</span>
              <span>Ministry of Education Compliant</span>
              <span>&bull;</span>
              <span>Encrypted Audit Ledger</span>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Gemini AI Launcher Button (Desktop/Tablet) */}
      {!isSmartphone && (
        <button
          type="button"
          onClick={() => setIsAiChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl p-3.5 shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group border border-emerald-400/40 cursor-pointer"
          title="Open SchoolLink Gemini AI Studio"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-tight">SchoolLink AI</div>
            <div className="text-[10px] text-emerald-100 font-medium">Search & Maps Grounding</div>
          </div>
        </button>
      )}

      {/* Modals */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onOpenCreateSchool={() => setIsCreateSchoolOpen(true)}
        onOpenRegisterUser={() => setIsRegisterUserOpen(true)}
      />

      <SchoolCreationModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />

      <UserRegistrationModal
        isOpen={isRegisterUserOpen}
        onClose={() => setIsRegisterUserOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <DailyMasterCodeModal
        isOpen={isDailyCodeOpen}
        onClose={() => setIsDailyCodeOpen(false)}
        onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <GoogleClassroomModal
        isOpen={isGoogleClassroomOpen}
        onClose={() => setIsGoogleClassroomOpen(false)}
      />

      <GoogleMeetModal
        isOpen={isGoogleMeetOpen}
        onClose={() => setIsGoogleMeetOpen(false)}
      />

      <SchoolModulesModal
        isOpen={isSchoolModulesOpen}
        onClose={() => setIsSchoolModulesOpen(false)}
        onOpenGeminiAI={() => {
          setIsSchoolModulesOpen(false);
          setIsAiChatbotOpen(true);
        }}
        onOpenGoogleClassroom={() => {
          setIsSchoolModulesOpen(false);
          setIsGoogleClassroomOpen(true);
        }}
        onOpenGoogleMeet={() => {
          setIsSchoolModulesOpen(false);
          setIsGoogleMeetOpen(true);
        }}
        onOpenDailyCode={() => {
          setIsSchoolModulesOpen(false);
          setIsDailyCodeOpen(true);
        }}
        onOpenAuditLogs={() => {
          setIsSchoolModulesOpen(false);
          setIsAuditLogsOpen(true);
        }}
      />

      <DigitalReportCardModal
        reportCard={activeReportCard}
        isOpen={!!activeReportCard}
        onClose={() => setActiveReportCard(null)}
      />

      {/* Gemini AI Multi-Turn Grounded Chatbot Modal */}
      {isAiChatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-5xl h-[85vh] max-h-[800px] flex">
            <GeminiChatbotStudio
              isOpen={isAiChatbotOpen}
              onClose={() => setIsAiChatbotOpen(false)}
              isModal={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <SchoolProvider>
      <DeviceProvider>
        <SchoolLinkAppContent />
      </DeviceProvider>
    </SchoolProvider>
  );
}

export default App;
