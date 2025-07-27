import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { useTaskInsights } from "../../api/use-task";
import { cn } from "../../../../lib/utils/cn";

export const InsightCards = () => {
  const { data: insights, isLoading } = useTaskInsights();

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-slate-600"></div>
            <div className="mb-2 h-8 w-1/3 rounded bg-gray-200 dark:bg-slate-600"></div>
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-600"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const cards = [
    {
      title: "Total Tasks",
      value: insights.totalTasks,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12% from last week",
      changeColor: "text-green-600",
    },
    {
      title: "Pending",
      value: insights.statusCounts.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: `${((insights.statusCounts.pending / insights.totalTasks) * 100).toFixed(1)}% of total`,
      changeColor: "text-gray-600",
    },
    {
      title: "In Progress",
      value: insights.statusCounts["in-progress"],
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `${((insights.statusCounts["in-progress"] / insights.totalTasks) * 100).toFixed(1)}% of total`,
      changeColor: "text-gray-600",
    },
    {
      title: "Completed",
      value: insights.statusCounts.done,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${insights.completionRate}% completion rate`,
      changeColor: "text-green-600",
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={cn("rounded-lg p-2 dark:bg-slate-700", card.bgColor)}
              >
                <Icon className={`h-5 w-5 ${card.color} dark:text-gray-300`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
