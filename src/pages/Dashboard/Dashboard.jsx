import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetCOA } from "@/store/coa/action";
import { useEffect } from "react";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { coas = [] } = useSelector((state) => state.coa || {});

  useEffect(() => {
    dispatch(asyncGetCOA());
  }, [dispatch]);

  // Hitung statistik COA per bulan
  const coaListByMonth = Array(12).fill(0);
  coas.forEach((coa) => {
    const month = new Date(coa.createdAt).getMonth();
    coaListByMonth[month]++;
  });

  // Hitung persentase status COA
  const totalCOAs = coas.length;
  const approvedCOAs = coas.filter((coa) => coa.approvedBy !== null).length;
  const pendingCOAs = coas.filter((coa) => coa.approvedBy === null).length;
  const draftCOAs = coas.filter((coa) => coa.status === "draft").length;
  const deletedCOAs = coas.filter((coa) => coa.status === "deleted").length;

  const approvedPercentage = totalCOAs
    ? Math.round((approvedCOAs / totalCOAs) * 100)
    : 0;
  const pendingPercentage = totalCOAs
    ? Math.round((pendingCOAs / totalCOAs) * 100)
    : 0;
  const draftPercentage = totalCOAs
    ? Math.round((draftCOAs / totalCOAs) * 100)
    : 0;
  const deletedPercentage = totalCOAs
    ? Math.round((deletedCOAs / totalCOAs) * 100)
    : 0;

  // Hitung tinggi maksimum untuk chart
  const maxHeight = Math.max(...coaListByMonth);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total COAs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCOAs}</div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCOAs}</div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved COAs
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCOAs}</div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">
                +1 new user this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent COAs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>COA Creation Overview</CardTitle>
                <CardDescription>
                  Monthly COA creation statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full flex items-end gap-2">
                  {coaListByMonth.map((count, i) => (
                    <div
                      key={i}
                      className="relative h-full flex-1 flex items-end"
                    >
                      <div
                        className="w-full bg-primary/80 rounded-sm hover:bg-primary transition-colors"
                        style={{ height: `${(count / maxHeight) * 100}%` }}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {
                          [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ][i]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>COA Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Approved</span>
                        <span className="text-sm text-muted-foreground">
                          {approvedPercentage}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${approvedPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pending</span>
                        <span className="text-sm text-muted-foreground">
                          {pendingPercentage}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                        <div
                          className="h-2 bg-yellow-500 rounded-full"
                          style={{ width: `${pendingPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Draft</span>
                        <span className="text-sm text-muted-foreground">
                          {draftPercentage}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${draftPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Deleted</span>
                        <span className="text-sm text-muted-foreground">
                          {deletedPercentage}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                        <div
                          className="h-2 bg-red-500 rounded-full"
                          style={{ width: `${deletedPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent COAs</CardTitle>
              <CardDescription>
                Recently created and updated COAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coas.map((coa, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {coa.lotNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Customer: {coa.costumerName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {coa.approvedBy === null ? "Pending" : "Approved"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(coa.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                COA creation and approval analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <BarChart className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Detailed analytics will be available here. Track COA creation,
                  approval times, and user activity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
