import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Paperclip,
  Video,
  FileText,
  Clock,
  CheckCheck,
  Sparkles,
  Search,
  BookOpen,
  ArrowLeft,
  Calendar,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { DirectMessage, User as UserType } from '../../types';

interface StudentTeacherChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTeacherId?: string;
  onLaunchInstantZoomWithTeacher?: (teacherName: string, subjectName: string) => void;
}

export const StudentTeacherChatModal: React.FC<StudentTeacherChatModalProps> = ({
  isOpen,
  onClose,
  preSelectedTeacherId,
  onLaunchInstantZoomWithTeacher
}) => {
  const {
    currentSchool,
    currentUser,
    allUsers,
    directMessages,
    sendDirectMessage,
    markMessageRead
  } = useSchool();

  // If student, list of teachers; if teacher, list of students/parents
  const isStudent = currentUser.role === 'student';
  const partnerRole = isStudent ? 'teacher' : 'student';

  const chatPartners = allUsers.filter(
    (u) => u.schoolId === currentSchool.id && (u.role === partnerRole || (isStudent && (u.role === 'deputy_head_teacher' || u.role === 'head_teacher')))
  );

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    preSelectedTeacherId || chatPartners[0]?.id || ''
  );
  const [messageText, setMessageText] = useState('');
  const [subjectTopic, setSubjectTopic] = useState('');
  const [searchPartner, setSearchPartner] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const activePartner = allUsers.find((u) => u.id === selectedPartnerId) || chatPartners[0];

  // Filter messages between currentUser and activePartner
  const conversationMessages = directMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activePartner?.id) ||
      (m.senderId === activePartner?.id && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartner) return;

    sendDirectMessage({
      schoolId: currentSchool.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      receiverId: activePartner.id,
      receiverName: activePartner.fullName,
      receiverRole: activePartner.role,
      subject: subjectTopic || `Inquiry with ${activePartner.fullName}`,
      content: messageText.trim(),
      relatedSubject: isStudent ? 'Mathematics / ECZ Revision' : 'Class Progress',
      attachmentName: attachmentFile || undefined,
      attachmentType: attachmentFile ? 'pdf' : undefined,
    });

    setMessageText('');
    setSubjectTopic('');
    setAttachmentFile(null);
  };

  const handleTemplateInquiry = (templateText: string, topic: string) => {
    setMessageText(templateText);
    setSubjectTopic(topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col md:flex-row overflow-hidden border border-slate-200 shadow-2xl">
        
        {/* LEFT DIRECTORY COLUMN */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isStudent ? 'Subject Teachers' : 'Student Discussions'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Direct MoE Line
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchPartner}
                onChange={(e) => setSearchPartner(e.target.value)}
                placeholder="Filter by name..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Directory List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {chatPartners
              .filter((p) => p.fullName.toLowerCase().includes(searchPartner.toLowerCase()))
              .map((partner) => {
                const isSelected = partner.id === activePartner?.id;
                const lastMsg = directMessages
                  .filter((m) => (m.senderId === partner.id && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === partner.id))
                  .slice(-1)[0];

                return (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition ${
                      isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{partner.fullName}</h4>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {partner.teacherProfile?.specialization || partner.role.replace('_', ' ').toUpperCase()}
                      </p>
                      {lastMsg && (
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* RIGHT CONVERSATION THREAD */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Thread Header */}
          {activePartner ? (
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.avatarUrl}
                  alt={activePartner.fullName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{activePartner.fullName}</h3>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {activePartner.role === 'teacher' ? 'Faculty Instructor' : 'Learner'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {activePartner.email} &bull; {currentSchool.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onLaunchInstantZoomWithTeacher && (
                  <button
                    onClick={() => onLaunchInstantZoomWithTeacher(activePartner.fullName, 'Academic Consultation')}
                    className="px-3 py-1.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                    title="Launch instant 1-on-1 Zoom video call"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Launch 1-on-1 Zoom</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 flex justify-end">
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">✕</button>
            </div>
          )}

          {/* Quick Inquiry Templates for Students */}
          {isStudent && (
            <div className="bg-emerald-50/50 p-2.5 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[11px] font-bold text-emerald-800 whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick Inquiries:
              </span>
              <button
                onClick={() => handleTemplateInquiry('Good day Sir, could you please clarify the homework solution for Question 4 from the ECZ past paper?', 'Homework Assistance')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 whitespace-nowrap text-[11px] font-medium transition"
              >
                Homework Clarification
              </button>
              <button
                onClick={() => handleTemplateInquiry('Sir, may I request a short 10-minute 1-on-1 Zoom consultation this afternoon to review turning points of quadratic curves?', '1-on-1 Zoom Request')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 whitespace-nowrap text-[11px] font-medium transition"
              >
                Request 1-on-1 Zoom Review
              </button>
              <button
                onClick={() => handleTemplateInquiry('Thank you Sir for the feedback on my continuous assessment test. I have corrected the calculations in my notebook.', 'CA Test Followup')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 whitespace-nowrap text-[11px] font-medium transition"
              >
                C.A. Score Feedback
              </button>
            </div>
          )}

          {/* Message Thread Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
            {conversationMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">No messages yet</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Start an academic discussion with {activePartner?.fullName}. Direct messages are recorded in the official school communication ledger.
                </p>
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-600">{msg.senderName}</span>
                      <span>&bull;</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {msg.subject && (
                        <p className={`font-bold text-[11px] mb-1 ${isMe ? 'text-emerald-200' : 'text-emerald-800'}`}>
                          {msg.subject}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.attachmentName && (
                        <div className={`mt-2.5 p-2 rounded-xl flex items-center gap-2 text-[11px] font-medium ${
                          isMe ? 'bg-emerald-800/60 text-emerald-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          <FileText className="w-4 h-4 shrink-0 text-emerald-300" />
                          <span className="truncate">{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Thread Footer & Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex flex-col gap-2">
            {attachmentFile && (
              <div className="flex items-center justify-between bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5" /> Attached: {attachmentFile}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachmentFile(null)}
                  className="text-emerald-900 font-bold hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachmentFile('Quadratic_Equations_Working_Submission.pdf')}
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                title="Attach PDF Homework Working"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Type your message to ${activePartner?.fullName || 'teacher'}...`}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-slate-50"
              />

              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
