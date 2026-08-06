"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMission, useUpdateMission } from "@/hooks/use-mission";
import type { Mission, TargetCompany } from "@/lib/types";

export default function MissionPage() {
  const { data: mission } = useMission();
  const updateMission = useUpdateMission();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">🎯 Mission</h1>
      {mission && (
        <MissionForm
          mission={mission}
          onSave={(patch) => updateMission.mutate(patch)}
          saving={updateMission.isPending}
        />
      )}
    </div>
  );
}

/** Mounted only once `mission` has loaded, so its local state can be
 * lazily-initialized from props directly — no effect needed to sync it in. */
function MissionForm({
  mission,
  onSave,
  saving,
}: {
  mission: Mission;
  onSave: (patch: Partial<Omit<Mission, "id">>) => void;
  saving: boolean;
}) {
  const [companies, setCompanies] = useState<TargetCompany[]>(mission.target_companies);
  const [newCompany, setNewCompany] = useState("");
  const [salaryGoal, setSalaryGoal] = useState(mission.salary_goal ?? "");
  const [deadline, setDeadline] = useState(mission.deadline ?? "");
  const [northStar, setNorthStar] = useState(mission.north_star ?? "");

  function toggleCompany(name: string) {
    setCompanies((prev) => prev.map((c) => (c.name === name ? { ...c, checked: !c.checked } : c)));
  }

  function addCompany() {
    if (!newCompany.trim()) return;
    setCompanies((prev) => [...prev, { name: newCompany.trim(), checked: false }]);
    setNewCompany("");
  }

  function save() {
    onSave({
      target_companies: companies,
      salary_goal: salaryGoal || null,
      deadline: deadline || null,
      north_star: northStar || null,
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Target Companies</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {companies.map((c) => (
            <label key={c.name} className="flex items-center gap-2 text-sm">
              <Checkbox checked={c.checked} onCheckedChange={() => toggleCompany(c.name)} />
              {c.name}
            </label>
          ))}
          <div className="flex gap-2">
            <Input
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompany()}
              placeholder="Add a company…"
              className="h-8"
            />
            <Button type="button" size="sm" variant="secondary" onClick={addCompany}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="salary">Salary Goal</Label>
            <Input id="salary" value={salaryGoal} onChange={(e) => setSalaryGoal(e.target.value)} placeholder="35+ LPA" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="February 2027" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="north-star">North Star</Label>
            <Textarea id="north-star" value={northStar} onChange={(e) => setNorthStar(e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="self-start">
        {saving ? "Saving…" : "Save"}
      </Button>
    </>
  );
}
