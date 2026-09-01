import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  Sparkles,
  CheckCircle2,
  Copy,
  RotateCcw,
  RotateCw,
  School,
  Award,
  BookOpen,
  Send,
  FileDown,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { draftDocument } from '../../services/apiClient';

interface TeacherWordStudioProps {
  initialTemplate?: 'lesson_plan' | 'exam_paper' | 'scheme_of_work' | 'parent_letter';
}

export const TeacherWordStudio: React.FC<TeacherWordStudioProps> = ({ initialTemplate }) => {
  const { currentSchool, currentUser } = useSchool();

  const [activeRibbonTab, setActiveRibbonTab] = useState<'home' | 'insert' | 'layout' | 'templates' | 'ai_drafter'>('home');
  const [documentTitle, setDocumentTitle] = useState('Grade 9 Mathematics - Term 1 Lesson Plan.docx');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [aiDraftType, setAiDraftType] = useState<'lesson_plan' | 'exam_paper' | 'scheme_of_work' | 'parent_letter'>('lesson_plan');
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [aiGrade, setAiGrade] = useState('9');
  const [aiTopic, setAiTopic] = useState('Simultaneous Linear Equations & Graphical Solutions');
  const [aiObjectives, setAiObjectives] = useState('Solve 2-variable linear equations using substitution and elimination methods');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Default lesson plan HTML template
  const defaultLessonPlanHtml = `
    <div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 12px; margin-bottom: 16px;">
      <h2 style="font-size: 18px; font-weight: bold; margin: 0; color: #1E293B; text-transform: uppercase;">${currentSchool.name}</h2>
      <p style="font-size: 11px; margin: 2px 0; color: #475569;">${currentSchool.address} &bull; ${currentSchool.city}, ${currentSchool.province}</p>
      <p style="font-size: 11px; font-weight: bold; margin: 2px 0; color: #047857;">MINISTRY OF EDUCATION &bull; ECZ CURRICULUM STANDARDS</p>
      <h3 style="font-size: 14px; font-weight: bold; margin-top: 8px; color: #0F172A; text-decoration: underline;">OFFICIAL TEACHER LESSON PLAN</h3>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px;">
      <tr>
        <td style="border: 1px solid #CBD5E1; padding: 6px 10px; background-color: #F8FAFC; width: 25%;"><strong>Subject:</strong> Mathematics</td>
        <td style="border: 1px solid #CBD5E1; padding: 6px 10px; width: 25%;"><strong>Grade & Class:</strong> Grade 9A</td>
        <td style="border: 1px solid #CBD5E1; padding: 6px 10px; background-color: #F8FAFC; width: 25%;"><strong>Date & Time:</strong> ${new Date().toLocaleDateString()} (80 Mins)</td>
        <td style="border: 1px solid #CBD5E1; padding: 6px 10px; width: 25%;"><strong>Teacher:</strong> ${currentUser.fullName}</td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #CBD5E1; padding: 6px 10px; background-color: #F8FAFC;"><strong>Topic:</strong> Algebraic Equations</td>
        <td colspan="2" style="border: 1px solid #CBD5E1; padding: 6px 10px;"><strong>Sub-Topic:</strong> Solving Simultaneous Linear Equations</td>
      </tr>
    </table>

    <h4 style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 12px; margin-bottom: 4px; border-left: 4px solid #047857; padding-left: 6px;">1. SPECIFIC LEARNING OUTCOMES</h4>
    <p style="font-size: 12px; margin: 4px 0;">By the end of the 80-minute lesson, learners should be able to:</p>
    <ul style="font-size: 12px; margin: 4px 0 12px 20px;">
      <li>Identify pairs of simultaneous linear equations in two unknown variables.</li>
      <li>Apply the <strong>elimination method</strong> correctly to find the value of the first variable.</li>
      <li>Substitute back into the original equation to determine the second variable and verify results.</li>
    </ul>

    <h4 style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 12px; margin-bottom: 4px; border-left: 4px solid #047857; padding-left: 6px;">2. TEACHING AIDS & LEARNING RESOURCES</h4>
    <p style="font-size: 12px; margin: 4px 0 12px 0;">Chalkboard, colored chalk, scientific calculators, ECZ Mathematics Grade 9 Pupil's Book (Pages 42–48), past examination question cards.</p>

    <h4 style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 12px; margin-bottom: 4px; border-left: 4px solid #047857; padding-left: 6px;">3. LESSON SEQUENCE & METHODOLOGY</h4>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px;">
      <thead>
        <tr style="background-color: #0F172A; color: #FFFFFF;">
          <th style="border: 1px solid #0F172A; padding: 6px; width: 15%;">Stage / Time</th>
          <th style="border: 1px solid #0F172A; padding: 6px; width: 42%;">Teacher's Activity</th>
          <th style="border: 1px solid #0F172A; padding: 6px; width: 43%;">Learners' Activity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #CBD5E1; padding: 6px; font-weight: bold; background-color: #F8FAFC;">Introduction (10 min)</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Review single-variable linear equations (e.g. 2x + 4 = 10). Pose a real-world scenario involving two unknown prices.</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Respond to mental maths questions and formulate algebraic statements from word problems.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #CBD5E1; padding: 6px; font-weight: bold; background-color: #F8FAFC;">Development (30 min)</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Demonstrate elimination method step-by-step for: <em>2x + y = 7</em> and <em>x - y = 2</em>. Highlight sign changes when subtracting.</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Follow board examples, copy key steps into exercise notebooks, and attempt sample problem in pairs.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #CBD5E1; padding: 6px; font-weight: bold; background-color: #F8FAFC;">Class Exercise (25 min)</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Circulate to monitor working, assist struggling learners with remedial hints, and check calculation steps.</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Work independently on Exercise 4B (Questions 1 to 5) from ECZ textbook.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #CBD5E1; padding: 6px; font-weight: bold; background-color: #F8FAFC;">Conclusion (15 min)</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Invite two learners to solve questions 3 and 4 on the chalkboard. Assign homework (Questions 6–10).</td>
          <td style="border: 1px solid #CBD5E1; padding: 6px;">Review chalkboard solutions, self-correct notebooks, and record homework tasks.</td>
        </tr>
      </tbody>
    </table>

    <h4 style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 12px; margin-bottom: 4px; border-left: 4px solid #047857; padding-left: 6px;">4. TEACHER'S SELF-EVALUATION</h4>
    <p style="font-size: 12px; margin: 4px 0 16px 0; color: #334155;"><em>Lesson objectives achieved successfully. 88% of learners solved simultaneous equations accurately using elimination. 4 learners will receive brief remedial support during study period.</em></p>

    <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed #94A3B8; display: flex; justify-content: space-between; font-size: 11px; color: #475569;">
      <div>
        <p><strong>Teacher's Signature:</strong> ________________________</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
      <div>
        <p><strong>Head of Department / Deputy Signature:</strong> ________________________</p>
        <p>Approval Stamp: [ APPROVED ]</p>
      </div>
    </div>
  `;

  const [documentContent, setDocumentContent] = useState<string>(defaultLessonPlanHtml);

  // Formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setDocumentContent(editorRef.current.innerHTML);
    }
  };

  // Insert school header
  const handleInsertSchoolHeader = () => {
    const headerHtml = `
      <div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 12px; margin-bottom: 16px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0; color: #1E293B; text-transform: uppercase;">${currentSchool.name}</h2>
        <p style="font-size: 11px; margin: 2px 0; color: #475569;">${currentSchool.address} &bull; ${currentSchool.city}, ${currentSchool.province}</p>
        <p style="font-size: 11px; font-weight: bold; margin: 2px 0; color: #047857;">OFFICIAL ACADEMIC CORRESPONDENCE</p>
      </div>
    `;
    executeCommand('insertHTML', headerHtml);
  };

  // Insert ECZ Exam Header Box
  const handleInsertExamHeader = () => {
    const examHtml = `
      <div style="border: 2px solid #0F172A; padding: 12px; margin-bottom: 16px; text-align: center; background-color: #F8FAFC;">
        <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #0F172A; text-transform: uppercase;">${currentSchool.name}</h3>
        <h4 style="margin: 4px 0; font-size: 13px; font-weight: bold; color: #047857;">END OF TERM CONTINUOUS ASSESSMENT EXAMINATION</h4>
        <p style="margin: 4px 0; font-size: 11px; font-weight: bold;">SUBJECT: MATHEMATICS | GRADE: 9 | TIME ALLOWED: 2 HOURS</p>
        <div style="text-align: left; font-size: 11px; margin-top: 8px; border-top: 1px solid #CBD5E1; padding-top: 6px;">
          <strong>CANDIDATE NAME:</strong> _____________________________________ &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>EXAM NO:</strong> ______________________
        </div>
      </div>
    `;
    executeCommand('insertHTML', examHtml);
  };

  // Insert Question template
  const handleInsertQuestion = () => {
    const qHtml = `
      <div style="margin-bottom: 14px; font-size: 12px;">
        <p><strong>Question 1.</strong> (a) Express the ratio 45 minutes to 2 hours in its simplest integer form. <span style="float: right; font-weight: bold;">[2 Marks]</span></p>
        <div style="height: 35px; border-bottom: 1px dotted #94A3B8;"></div>
        <p style="margin-top: 6px;">(b) Solve for <em>x</em> in the equation: 3(2x - 4) = 18. <span style="float: right; font-weight: bold;">[3 Marks]</span></p>
        <div style="height: 45px; border-bottom: 1px dotted #94A3B8;"></div>
      </div>
    `;
    executeCommand('insertHTML', qHtml);
  };

  // Insert Signoff Stamp
  const handleInsertSignoff = () => {
    const signHtml = `
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed #94A3B8; display: flex; justify-content: space-between; font-size: 11px; color: #475569;">
        <div>
          <p><strong>Subject Teacher:</strong> ${currentUser.fullName}</p>
          <p>Signature: ________________________ &nbsp;&nbsp; Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>Head Teacher:</strong> Approved & Verified</p>
          <p>Official School Seal / Stamp: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</p>
        </div>
      </div>
    `;
    executeCommand('insertHTML', signHtml);
  };

  // AI Document Generator
  const handleGenerateAiDocument = async () => {
    setIsAiDrafting(true);
    try {
      const data = await draftDocument({
        docType: aiDraftType,
        title: documentTitle,
        subject: aiSubject,
        grade: aiGrade,
        topic: aiTopic,
        objectives: aiObjectives,
        schoolName: currentSchool.name,
      });
      if (data.content) {
        // Format text into HTML paragraphs
        const formattedHtml = `
          <div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="font-size: 18px; font-weight: bold; margin: 0; color: #1E293B; text-transform: uppercase;">${currentSchool.name}</h2>
            <p style="font-size: 11px; margin: 2px 0; color: #475569;">${currentSchool.address} &bull; ${currentSchool.city}, ${currentSchool.province}</p>
            <p style="font-size: 11px; font-weight: bold; margin: 2px 0; color: #047857;">ECZ ACADEMIC DEPARTMENT &bull; GRADE ${aiGrade} ${aiSubject.toUpperCase()}</p>
          </div>
          <div style="font-size: 12px; line-height: 1.6; color: #1E293B; white-space: pre-line;">
            ${data.content.replace(/\n\n/g, '<br/><br/>')}
          </div>
        `;
        setDocumentContent(formattedHtml);
        if (editorRef.current) {
          editorRef.current.innerHTML = formattedHtml;
        }
        setSaveStatus('AI Draft generated and loaded into Word Studio!');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiDrafting(false);
    }
  };

  // Export as Word (.doc)
  const handleExportWordDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${documentTitle}</title></head>
      <body style="font-family: Arial, sans-serif; padding: 30px;">
        ${editorRef.current ? editorRef.current.innerHTML : documentContent}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = documentTitle.endsWith('.docx') ? documentTitle : `${documentTitle}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden flex flex-col">
      {/* WORD TOP TITLE BAR */}
      <div className="bg-[#2B579A] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3F73]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                Microsoft Word for Teachers
              </span>
              <span className="text-xs text-blue-100 font-medium">
                {currentSchool.name} &bull; Teacher Document Suite
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-white/40 focus:border-white focus:outline-none px-1 py-0.5 rounded max-w-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSaveStatus('Document saved to SchoolLink Teacher Cloud Storage!');
              setTimeout(() => setSaveStatus(null), 4000);
            }}
            className="px-3.5 py-1.5 bg-white text-[#2B579A] hover:bg-blue-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Cloud</span>
          </button>

          <button
            onClick={handleExportWordDoc}
            className="px-3 py-1.5 bg-[#1E3F73] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download .doc</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-2.5 py-1.5 bg-[#1E3F73] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition"
            title="Print Document"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WORD RIBBON TABS */}
      <div className="bg-[#F3F2F1] border-b border-slate-300 px-4 pt-2 flex items-center gap-1 overflow-x-auto text-xs font-medium text-slate-700">
        {[
          { id: 'home', label: 'Home & Typography' },
          { id: 'insert', label: 'Insert (Header, Exam, Stamps)' },
          { id: 'templates', label: 'Lesson & Exam Templates' },
          { id: 'ai_drafter', label: 'AI Document Drafter' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRibbonTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-t-lg transition font-semibold ${
              activeRibbonTab === tab.id
                ? 'bg-white text-[#2B579A] border-t-2 border-t-[#2B579A] border-l border-r border-slate-300 shadow-2xs font-bold'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RIBBON TOOLBAR */}
      <div className="bg-[#F8F9FA] border-b border-slate-300 p-2.5 flex flex-wrap items-center gap-2 text-xs">
        {activeRibbonTab === 'home' && (
          <>
            {/* Font Family & Size */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <select
                onChange={(e) => executeCommand('fontName', e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
              >
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
              </select>

              <select
                onChange={(e) => executeCommand('fontSize', e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
              >
                <option value="2">10pt</option>
                <option value="3" selected>12pt (Standard)</option>
                <option value="4">14pt (Subheading)</option>
                <option value="5">18pt (Heading)</option>
                <option value="6">24pt (Title)</option>
              </select>
            </div>

            {/* Formatting buttons */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => executeCommand('bold')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800 font-bold"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('strikeThrough')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
              >
                H1
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
              >
                H2
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<p>')}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-800 text-[11px]"
              >
                Normal
              </button>
            </div>

            {/* Alignments */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => executeCommand('justifyLeft')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyFull')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Justify"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Bullet Points"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-800"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {activeRibbonTab === 'insert' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleInsertSchoolHeader}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <School className="w-4 h-4 text-[#2B579A]" />
              <span>Insert Official School Letterhead</span>
            </button>

            <button
              onClick={handleInsertExamHeader}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Award className="w-4 h-4 text-[#2B579A]" />
              <span>Insert ECZ Examination Header Box</span>
            </button>

            <button
              onClick={handleInsertQuestion}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-[#2B579A]" />
              <span>Insert Question Structure ([Marks])</span>
            </button>

            <button
              onClick={handleInsertSignoff}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Insert Head Teacher Stamp & Signature Block</span>
            </button>
          </div>
        )}

        {activeRibbonTab === 'templates' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setDocumentTitle('Grade 9 Mathematics - Term 1 Lesson Plan.docx');
                setDocumentContent(defaultLessonPlanHtml);
                if (editorRef.current) editorRef.current.innerHTML = defaultLessonPlanHtml;
              }}
              className="px-3 py-1.5 bg-[#2B579A] text-white rounded-lg font-bold text-xs hover:bg-blue-800 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Standard Lesson Plan (ECZ)</span>
            </button>

            <button
              onClick={() => {
                setDocumentTitle('Grade 9 End of Term Examination Paper.docx');
                const examHtml = `
                  <div style="border: 2px solid #0F172A; padding: 12px; margin-bottom: 16px; text-align: center; background-color: #F8FAFC;">
                    <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #0F172A; text-transform: uppercase;">${currentSchool.name}</h3>
                    <h4 style="margin: 4px 0; font-size: 13px; font-weight: bold; color: #047857;">END OF TERM 1 EXAMINATION - 2026</h4>
                    <p style="margin: 4px 0; font-size: 11px; font-weight: bold;">SUBJECT: MATHEMATICS | GRADE: 9 | TIME: 2 HOURS</p>
                    <div style="text-align: left; font-size: 11px; margin-top: 8px; border-top: 1px solid #CBD5E1; padding-top: 6px;">
                      <strong>CANDIDATE NAME:</strong> _____________________________________ &nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>EXAM NO:</strong> ______________________
                    </div>
                  </div>
                  <h4>SECTION A: MULTIPLE CHOICE (20 MARKS)</h4>
                  <p>1. Evaluate 14 - 3 × 4 + 6.<br/>A. 8 &nbsp;&nbsp;&nbsp;&nbsp; B. 2 &nbsp;&nbsp;&nbsp;&nbsp; C. 14 &nbsp;&nbsp;&nbsp;&nbsp; D. 50</p>
                  <h4>SECTION B: STRUCTURED QUESTIONS (40 MARKS)</h4>
                  <p><strong>Question 1:</strong> (a) Solve the simultaneous equations: 2x + y = 11 and x - y = 1. <span style="float: right;">[4 Marks]</span></p>
                  <div style="height: 50px; border-bottom: 1px dotted #94A3B8;"></div>
                `;
                setDocumentContent(examHtml);
                if (editorRef.current) editorRef.current.innerHTML = examHtml;
              }}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-xs hover:bg-slate-100"
            >
              Exam Question Paper
            </button>

            <button
              onClick={() => {
                setDocumentTitle('Official Parent Communication Notice.docx');
                const letterHtml = `
                  <div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 12px; margin-bottom: 16px;">
                    <h2 style="font-size: 18px; font-weight: bold; margin: 0; color: #1E293B; text-transform: uppercase;">${currentSchool.name}</h2>
                    <p style="font-size: 11px; margin: 2px 0; color: #475569;">${currentSchool.address} &bull; ${currentSchool.city}, ${currentSchool.province}</p>
                    <p style="font-size: 11px; font-weight: bold; margin: 2px 0; color: #047857;">OFFICE OF THE HEAD TEACHER &bull; ACADEMIC AFFAIRS</p>
                  </div>
                  <p style="font-size: 12px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p style="font-size: 12px;"><strong>TO:</strong> All Parents and Guardians of Grade 9 Learners</p>
                  <p style="font-size: 12px;"><strong>RE:</strong> CONTINUOUS ASSESSMENT RESULTS & UPCOMING PARENTS' CONSULTATION DAY</p>
                  <p style="font-size: 12px; line-height: 1.6;">Dear Parents/Guardians,<br/><br/>
                  We wish to commend all learners for their diligent efforts during the first round of Continuous Assessment (CA) tests. Terminal report cards are currently available on the SchoolLink portal.<br/><br/>
                  We cordially invite you to our Term 1 Academic Consultation Day on Friday at 09:00 hrs in the School Main Hall. This meeting provides an invaluable opportunity to review your child's progress with individual subject teachers.</p>
                  <p style="font-size: 12px; margin-top: 24px;">Yours in Education,<br/><br/><strong>Head Teacher</strong><br/>${currentSchool.name}</p>
                `;
                setDocumentContent(letterHtml);
                if (editorRef.current) editorRef.current.innerHTML = letterHtml;
              }}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-xs hover:bg-slate-100"
            >
              Parent Circular Letter
            </button>
          </div>
        )}

        {activeRibbonTab === 'ai_drafter' && (
          <div className="flex flex-wrap items-center gap-2 w-full">
            <select
              value={aiDraftType}
              onChange={(e) => setAiDraftType(e.target.value as any)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-bold"
            >
              <option value="lesson_plan">Lesson Plan</option>
              <option value="exam_paper">Exam Question Paper</option>
              <option value="scheme_of_work">Scheme of Work</option>
              <option value="parent_letter">Parent Notice Letter</option>
            </select>

            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Topic (e.g. Photosynthesis, Quadratic Equations)"
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 flex-1 min-w-[200px]"
            />

            <button
              onClick={handleGenerateAiDocument}
              disabled={isAiDrafting}
              className="px-3 py-1 bg-[#2B579A] text-white hover:bg-blue-800 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiDrafting ? 'Drafting Document...' : 'AI Generate Document'}</span>
            </button>
          </div>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {saveStatus && (
        <div className="bg-blue-100 border-b border-blue-300 text-blue-900 px-4 py-2 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* DOCUMENT CANVAS CONTAINER (A4 PAGE SIMULATION) */}
      <div className="bg-[#525659] p-6 overflow-y-auto max-h-[640px] flex justify-center">
        <div
          className="bg-white text-slate-900 shadow-2xl rounded-sm p-10 sm:p-14 w-full max-w-[850px] min-h-[900px] border border-slate-300 font-serif leading-relaxed outline-none transition-transform"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Editable Document Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setDocumentContent(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: documentContent }}
            className="outline-none min-h-[750px] focus:ring-0 text-slate-900"
          />
        </div>
      </div>

      {/* WORD BOTTOM STATUS BAR */}
      <div className="bg-[#2B579A] text-white px-4 py-1.5 flex items-center justify-between text-xs border-t border-[#1E3F73]">
        <div className="flex items-center gap-4 text-[11px] text-blue-100">
          <span>Page 1 of 1</span>
          <span>{documentContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length} Words</span>
          <span>English (Zambia)</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
            className="hover:text-white text-blue-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
            className="hover:text-white text-blue-200"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
