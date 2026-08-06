"use client";

import { ReviewForm } from "@/components/review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentMonthStart, currentWeekStart } from "@/lib/dates";
import {
  useMonthlyReviews,
  useUpsertMonthlyReview,
  useUpsertWeeklyReview,
  useWeeklyReviews,
} from "@/hooks/use-reviews";

export default function ReviewsPage() {
  const weekStart = currentWeekStart();
  const monthStart = currentMonthStart();

  const { data: weeklyReviews } = useWeeklyReviews();
  const { data: monthlyReviews } = useMonthlyReviews();
  const upsertWeekly = useUpsertWeeklyReview(weekStart);
  const upsertMonthly = useUpsertMonthlyReview(monthStart);

  const thisWeek = weeklyReviews?.find((r) => r.week_start === weekStart);
  const thisMonth = monthlyReviews?.find((r) => r.month_start === monthStart);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">📈 Reviews</h1>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Week of {weekStart}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewForm initial={thisWeek} onSave={(f) => upsertWeekly.mutate(f)} saving={upsertWeekly.isPending} />
            </CardContent>
          </Card>
          <PastReviews items={weeklyReviews?.filter((r) => r.week_start !== weekStart)} dateKey="week_start" />
        </TabsContent>

        <TabsContent value="monthly" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Month of {monthStart}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewForm
                initial={thisMonth}
                onSave={(f) => upsertMonthly.mutate(f)}
                saving={upsertMonthly.isPending}
              />
            </CardContent>
          </Card>
          <PastReviews items={monthlyReviews?.filter((r) => r.month_start !== monthStart)} dateKey="month_start" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PastReviews<T extends { id: number; what_proud: string | null }>({
  items,
  dateKey,
}: {
  items: T[] | undefined;
  dateKey: keyof T;
}) {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Past</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {items.map((item) => (
          <p key={item.id}>
            <span className="text-muted-foreground">{String(item[dateKey])}</span>
            {item.what_proud ? ` — ${item.what_proud}` : ""}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
