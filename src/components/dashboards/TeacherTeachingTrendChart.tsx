import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  ChevronRight,
  Info,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TeacherDailyDutyLog, TeacherLessonPeriod } from '../../types';

interface TeacherTeachingTrendChartProps {
  teacherId?: string;
  className?: string;
  showCardWrapper?: boolean;
}

export const TeacherTeachingTrendChart: React.FC<TeacherTeachingTrendChartProps> = ({
  teacherId,
  className = '',
  showCardWrapper = true
}) => {
  const { currentSchool, currentUser, teacherDutyLogs } = useSchool();

  // Target teacher
  const targetTeacherId = teacherId || currentUser.id;

  // View Controls
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous' | 'all'>('current');
  const [chartType, setChartType] = useState<'composed' | 'stacked' | 'area' | 'reasons'>('composed');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  // Filter logs for target teacher
  const teacherLogs = useMemo(() => {
    return teacherDutyLogs.filter(
      (log) => log.teacherId === targetTeacherId || log.teacherName === currentUser.fullName
    );
  }, [teacherDutyLogs, targetTeacherId, currentUser.fullName]);

  // Days of current week (Monday Aug 24 to Friday Aug 28, 2026)
  const currentWeekDays = [
    { date: '2026-08-24', dayName: 'Mon', fullDay: 'Monday, 24 Aug' },
    { date: '2026-08-25', dayName: 'Tue', fullDay: 'Tuesday, 25 Aug' },
    { date: '2026-08-26', dayName: 'Wed', fullDay: 'Wednesday, 26 Aug' },
    { date: '2026-08-27', dayName: 'Thu', fullDay: 'Thursday, 27 Aug' },
    { date: '2026-08-28', dayName: 'Fri', fullDay: 'Friday, 28 Aug' },
  ];

  // Transform logs into Recharts-friendly data series
  const weeklyChartData = useMemo(() => {
    return currentWeekDays.map((day) => {
      const log = teacherLogs.find((l) => l.date === day.date);
      let periods = log?.periods || [];

      // Filter by class if selected
      if (filterClass !== 'all') {
        periods = periods.filter((p) => p.className.toLowerCase().includes(filterClass.toLowerCase()));
      }

      const taught = periods.filter((p) => p.status === 'taught').length;
      const notTaught = periods.filter((p) => p.status === 'not_taught').length;
      const total = periods.length;
      const rate = total > 0 ? Math.round((taught / total) * 100) : 0;

      // Extract reasons if any
      const reasons = periods
        .filter((p) => p.status === 'not_taught' && p.reasonIfNotTaught)
        .map((p) => `${p.className}: ${p.reasonIfNotTaught}`);

      return {
        date: day.date,
        day: day.dayName,
        fullDay: day.fullDay,
        taught,
        notTaught,
        total,
        rate,
        checkInTime: log?.checkInTime || '07:15 AM',
        checkOutTime: log?.checkOutTime || (log?.checkOutConfirmed ? '16:15 PM' : 'On Duty'),
        isApproved: log?.schoolManagerStatus === 'approved',
        periods,
        reasons,
      };
    });
  }, [teacherLogs, filterClass]);

  // Aggregate KPI Stats
  const stats = useMemo(() => {
    let totalScheduled = 0;
    let totalTaught = 0;
    let totalNotTaught = 0;

    weeklyChartData.forEach((d) => {
      totalScheduled += d.total;
      totalTaught += d.taught;
      totalNotTaught += d.notTaught;
    });

    const completionRate = totalScheduled > 0 ? Math.round((totalTaught / totalScheduled) * 100) : 0;

    // Reason frequency
    const reasonCounts: Record<string, number> = {};
    weeklyChartData.forEach((d) => {
      d.periods.forEach((p) => {
        if (p.status === 'not_taught') {
          const reason = p.reasonIfNotTaught || 'Administrative Relief / Activity';
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        }
      });
    });

    const reasonData = Object.entries(reasonCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalScheduled,
      totalTaught,
      totalNotTaught,
      completionRate,
      reasonData,
    };
  }, [weeklyChartData]);

  // Subject & Class breakdown data
  const classBreakdown = useMemo(() => {
    const map: Record<string, { className: string; subject: string; taught: number; notTaught: number; total: number }> = {};

    weeklyChartData.forEach((d) => {
      d.periods.forEach((p) => {
        const key = `${p.className} - ${p.subjectName}`;
        if (!map[key]) {
          map[key] = {
            className: p.className,
            subject: p.subjectName,
            taught: 0,
            notTaught: 0,
            total: 0,
          };
        }
        map[key].total += 1;
        if (p.status === 'taught') {
          map[key].taught += 1;
        } else {
          map[key].notTaught += 1;
        }
      });
    });

    return Object.values(map);
  }, [weeklyChartData]);

  // Selected Day Details
  const activeDayLog = useMemo(() => {
    if (!selectedDayDetail) return weeklyChartData[3]; // default to Thursday
    return weeklyChartData.find((d) => d.date === selectedDayDetail) || weeklyChartData[0];
  }, [selectedDayDetail, weeklyChartData]);

  // Color palette constants (Anti-Slop compliant, accessible)
  const COLORS = {
    taught: '#10B981', // Emerald
    notTaught: '#F43F5E', // Rose
    scheduled: '#64748B', // Slate
    rateLine: '#3B82F6', // Blue
    piePalette: ['#F43F5E', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'],
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl shadow-xl max-w-xs text-xs space-y-2 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-200">{data.fullDay}</span>
            <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded">
              {data.rate}% Taught
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Taught Periods:
              </span>
              <span className="font-bold text-white">{data.taught}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                Not Taught:
              </span>
              <span className="font-bold text-white">{data.notTaught}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Total Scheduled:</span>
              <span className="font-semibold text-slate-300">{data.total} periods</span>
            </div>
          </div>

          {data.reasons && data.reasons.length > 0 && (
            <div className="pt-1.5 border-t border-slate-800">
              <p className="text-[10px] text-amber-300 font-semibold mb-0.5">Not Taught Reason:</p>
              {data.reasons.map((r: string, idx: number) => (
                <p key={idx} className="text-[10px] text-slate-300 italic truncate">
                  &bull; {r}
                </p>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>In: {data.checkInTime}</span>
            <span>Out: {data.checkOutTime}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const content = (
    <div className="space-y-6" id="teaching-trend-chart-component">
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>TEACHING PERFORMANCE & REGISTER ANALYTICS</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Weekly Register Trend</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Weekly Classes Taught vs Not Taught Trend
          </h3>
          <p className="text-xs text-slate-600">
            Real-time visual monitoring of scheduled lesson periods, completion velocity, and registered non-teaching relief reasons.
          </p>
        </div>

        {/* View Mode & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">All Classes</option>
              <option value="9A">Grade 9A</option>
              <option value="9B">Grade 9B</option>
              <option value="10A">Grade 10A</option>
              <option value="11 Science">Grade 11 Science</option>
              <option value="12 Tech">Grade 12 Tech</option>
              <option value="Remedial">Grade 9 Remedial</option>
            </select>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setChartType('composed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                chartType === 'composed'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Bar & Completion Rate Trend"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Taught vs Untaught</span>
            </button>

            <button
              onClick={() => setChartType('stacked')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                chartType === 'stacked'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Stacked Daily Volume"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Stacked</span>
            </button>

            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Area Velocity Trend"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Velocity</span>
            </button>

            <button
              onClick={() => setChartType('reasons')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                chartType === 'reasons'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Reasons for Untaught Classes"
            >
              <PieChartIcon className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Reasons</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Scheduled */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scheduled</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{stats.totalScheduled}</div>
            <p className="text-[11px] text-slate-500">Weekly lesson periods</p>
          </div>
        </div>

        {/* Successfully Taught */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Taught</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-700">{stats.totalTaught}</div>
            <p className="text-[11px] text-emerald-600 font-medium">
              {stats.completionRate}% of timetable delivered
            </p>
          </div>
        </div>

        {/* Not Taught */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Not Taught</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-700">{stats.totalNotTaught}</div>
            <p className="text-[11px] text-rose-600 font-medium">
              {stats.totalScheduled > 0 ? Math.round((stats.totalNotTaught / stats.totalScheduled) * 100) : 0}% relief / administrative
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Completion Rate</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-800">{stats.completionRate}%</div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Official Status */}
        <div className="col-span-2 lg:col-span-1 bg-slate-900 text-white rounded-xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TSC Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <span>Compliant & On Track</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Verified by School Manager
            </p>
          </div>
        </div>
      </div>

      {/* MAIN RECHARTS CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>Daily Teaching Breakdown (Monday – Friday)</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                Week 4 (Aug 24 – Aug 28, 2026)
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Click on any day bar to inspect individual lesson periods, subjects, and register notes.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
              <span className="text-slate-600 font-medium">Taught Classes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
              <span className="text-slate-600 font-medium">Not Taught</span>
            </div>
            {chartType === 'composed' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
                <span className="text-slate-600 font-medium">Completion Rate (%)</span>
              </div>
            )}
          </div>
        </div>

        {/* CHART RENDERING */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'composed' ? (
              <ComposedChart
                data={weeklyChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    setSelectedDayDetail(e.activePayload[0].payload.date);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  stroke="#94A3B8"
                  fontSize={12}
                  fontWeight={600}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  stroke="#94A3B8"
                  fontSize={11}
                  allowDecimals={false}
                  domain={[0, 8]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  stroke="#94A3B8"
                  fontSize={11}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="taught"
                  name="Taught Classes"
                  fill={COLORS.taught}
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
                <Bar
                  yAxisId="left"
                  dataKey="notTaught"
                  name="Not Taught"
                  fill={COLORS.notTaught}
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rate"
                  name="Completion %"
                  stroke={COLORS.rateLine}
                  strokeWidth={3}
                  dot={{ r: 5, fill: COLORS.rateLine, strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            ) : chartType === 'stacked' ? (
              <BarChart
                data={weeklyChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    setSelectedDayDetail(e.activePayload[0].payload.date);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tickLine={false} stroke="#94A3B8" fontSize={12} fontWeight={600} />
                <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} allowDecimals={false} domain={[0, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="taught" stackId="a" fill={COLORS.taught} radius={[0, 0, 4, 4]} barSize={34} />
                <Bar dataKey="notTaught" stackId="a" fill={COLORS.notTaught} radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            ) : chartType === 'area' ? (
              <AreaChart
                data={weeklyChartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    setSelectedDayDetail(e.activePayload[0].payload.date);
                  }
                }}
              >
                <defs>
                  <linearGradient id="taughtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.taught} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.taught} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="notTaughtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.notTaught} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.notTaught} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tickLine={false} stroke="#94A3B8" fontSize={12} fontWeight={600} />
                <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} allowDecimals={false} domain={[0, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="taught"
                  name="Taught Classes"
                  stroke={COLORS.taught}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#taughtGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="notTaught"
                  name="Not Taught"
                  stroke={COLORS.notTaught}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#notTaughtGrad)"
                />
              </AreaChart>
            ) : (
              /* REASONS BREAKDOWN PIE / BAR */
              <div className="flex flex-col md:flex-row items-center justify-around h-full">
                <div className="w-full md:w-1/2 h-64 flex items-center justify-center">
                  {stats.reasonData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.reasonData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={4}
                          label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.reasonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.piePalette[index % COLORS.piePalette.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">Zero Untaught Classes</p>
                      <p className="text-[11px]">All scheduled classes have been taught!</p>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Registered Reasons for Untaught Periods:</span>
                  {stats.reasonData.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS.piePalette[i % COLORS.piePalette.length] }}
                        ></span>
                        <span className="text-slate-700 font-medium truncate max-w-xs">{r.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {r.value} {r.value === 1 ? 'period' : 'periods'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* QUICK DAY SELECTION STRIP */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-slate-500 font-medium">Select a day to view period logs:</span>
          <div className="flex items-center gap-1.5">
            {weeklyChartData.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDayDetail(day.date)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeDayLog.date === day.date
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{day.day}</span>
                <span className={`text-[10px] px-1 rounded ${
                  day.notTaught === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {day.taught}/{day.total}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DRILL-DOWN SECTION: PERIOD ATTENDANCE LOGS FOR SELECTED DAY */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">{activeDayLog.fullDay}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeDayLog.notTaught === 0
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {activeDayLog.taught} of {activeDayLog.total} Taught ({activeDayLog.rate}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Teacher Arrival: <strong className="text-slate-700">{activeDayLog.checkInTime}</strong> &bull; Departure:{' '}
              <strong className="text-slate-700">{activeDayLog.checkOutTime}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {activeDayLog.isApproved ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Manager
                </span>
              ) : (
                <span className="text-slate-600 font-medium">Duty Register Active</span>
              )}
            </span>
          </div>
        </div>

        {/* PERIODS TABLE / LIST */}
        <div className="space-y-2.5">
          {activeDayLog.periods.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No lesson periods scheduled for this day or matching the current filter.
            </div>
          ) : (
            activeDayLog.periods.map((period, idx) => (
              <div
                key={period.id || idx}
                className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  period.status === 'taught'
                    ? 'bg-white border-slate-200 hover:border-emerald-300'
                    : 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    period.status === 'taught'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    P{period.periodNumber}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{period.className}</span>
                      <span className="text-[11px] text-slate-600">&bull; {period.subjectName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {period.timeRange}
                      </span>
                      {period.room && (
                        <span className="text-[10px] text-slate-400">({period.room})</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      Topic: &ldquo;{period.topic || 'Curriculum Syllabus Standard'}&rdquo;
                    </p>
                    {period.curriculumReference && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        ECZ Ref: {period.curriculumReference}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Indicator & Reason */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {period.status === 'taught' ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Class Taught</span>
                    </span>
                  ) : (
                    <div className="text-right">
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Not Taught</span>
                      </span>
                      {period.reasonIfNotTaught && (
                        <span className="block text-[10px] text-rose-600 font-medium mt-0.5 max-w-xs truncate">
                          Reason: {period.reasonIfNotTaught}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CLASS-BY-CLASS SUBJECT COVERAGE TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Class & Subject Syllabus Teaching Matrix</span>
          </h4>
          <span className="text-xs text-slate-500 font-mono">Term 1, 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Class Stream</th>
                <th className="py-2.5 px-3">Subject Name</th>
                <th className="py-2.5 px-3 text-center">Scheduled</th>
                <th className="py-2.5 px-3 text-center">Taught</th>
                <th className="py-2.5 px-3 text-center">Not Taught</th>
                <th className="py-2.5 px-3 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classBreakdown.map((item, i) => {
                const rate = item.total > 0 ? Math.round((item.taught / item.total) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.className}</td>
                    <td className="py-2.5 px-3 text-slate-700">{item.subject}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-600">{item.total}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{item.taught}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">
                      <span className={`px-2 py-0.5 rounded border ${
                        item.notTaught > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        {item.notTaught}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-slate-800">{rate}%</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              rate >= 90 ? 'bg-emerald-500' : rate >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm ${className}`}>
      {content}
    </div>
  );
};
