"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  governanceApi,
  ControlTest,
  ControlTestType,
  ControlTestStatus,
  ControlTestResult,
  CreateControlTestData,
} from "@/lib/api/governance";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";

const testSchema = z.object({
  unified_control_id: z.string().uuid("Control is required"),
  control_asset_mapping_id: z.string().uuid().optional().or(z.literal("")),
  test_type: z.nativeEnum(ControlTestType),
  test_date: z.string().min(1, "Test date is required"),
  status: z.nativeEnum(ControlTestStatus),
  result: z.nativeEnum(ControlTestResult).optional().or(z.literal("")),
  effectiveness_score: z.coerce.number().min(0).max(100).optional(),
  test_procedure: z.string().optional(),
  observations: z.string().optional(),
  recommendations: z.string().optional(),
  tester_id: z.string().uuid().optional().or(z.literal("")),
});

type TestFormData = z.infer<typeof testSchema>;

interface ControlTestFormProps {
  test?: ControlTest | null;
  controlId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ControlTestForm({
  test,
  controlId,
  onSuccess,
  onCancel,
}: ControlTestFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: controlsData } = useQuery({
    queryKey: ["unified-controls-simple"],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 100 }),
  });

  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: test
      ? {
          unified_control_id: test.unified_control_id,
          control_asset_mapping_id: test.control_asset_mapping_id || "",
          test_type: test.test_type,
          test_date: new Date(test.test_date).toISOString().split('T')[0],
          status: test.status,
          result: test.result || "",
          effectiveness_score: test.effectiveness_score || undefined,
          test_procedure: test.test_procedure || "",
          observations: test.observations || "",
          recommendations: test.recommendations || "",
          tester_id: test.tester_id || "",
        }
      : {
          unified_control_id: controlId || "",
          test_type: ControlTestType.OPERATING,
          status: ControlTestStatus.PLANNED,
          test_date: new Date().toISOString().split('T')[0],
        },
  });

  const mutation = useMutation({
    mutationFn: (data: TestFormData) => {
      const payload: CreateControlTestData = {
        ...data,
        result: data.result === "" ? undefined : (data.result as ControlTestResult),
        control_asset_mapping_id: data.control_asset_mapping_id || undefined,
        tester_id: data.tester_id || undefined,
      };

      if (test) {
        return governanceApi.updateControlTest(test.id, payload);
      }
      return governanceApi.createControlTest(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Control test ${test ? "updated" : "recorded"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["control-tests"] });
      if (controlId) {
        queryClient.invalidateQueries({ queryKey: ["control-tests", controlId] });
      }
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save control test",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unified_control_id"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Unified Control *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!!controlId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control to test" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {controlsData?.data.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.control_identifier}: {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="test_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ControlTestType).map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t} Effectiveness
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="test_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ControlTestStatus).map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Result</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pending..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Pending / None</SelectItem>
                    {Object.values(ControlTestResult).map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="effectiveness_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effectiveness Score (0-100)</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="100" placeholder="e.g. 85" {...field} />
              </FormControl>
              <FormDescription>Quantitative assessment of control performance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="test_procedure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Procedure</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Steps taken to validate the control..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed findings during the test..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              test ? "Update Record" : "Save Result"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


