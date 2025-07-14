import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheck, FileText, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductionChart from "./Chart/LotProgress";
import TotalPlanningYear from "./Chart/TotalPlanningYear";
import LogsPage from "./Chart/Logs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { asyncGetDashboardSummary } from "@/store/dashboard/action";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const summary = useSelector((state) => state.dashboard.dashboardSummary);

  useEffect(() => {
    dispatch(asyncGetDashboardSummary());
  }, [dispatch]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            className="hover:scale-103 transition-all ease-in-out"
            onClick={() => navigate("/planning")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Planning Monthly
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalPlanning}</div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:scale-103 transition-all ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Planning Closed Monthly
              </CardTitle>
              <CircleCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary?.totalPlanningClosed}
              </div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            className="hover:scale-103 transition-all ease-in-out"
            onClick={() => navigate("/coa-history")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                COA Printed Mothly
              </CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary?.totalCoaPrinted}
              </div>
              <p className="text-xs text-muted-foreground">item</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="LotOverview" className="mt-6">
        <TabsList>
          <TabsTrigger value="LotOverview">Lot Overviews</TabsTrigger>
          <TabsTrigger value="PlanningYearly">Planning Yearly</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="LotOverview" className="space-y-4">
          <div className="">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{`Lot's Overview`}</CardTitle>
                <CardDescription>
                  Statistik lot dengan trend planning, checking, dan printing
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="w-full">
                  <ProductionChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="PlanningYearly">
          <Card>
            <CardHeader>
              <CardTitle>Total Planning Yearly</CardTitle>
              <CardDescription>
                Kalkulasi Planning Perbulan dalam 1 tahun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TotalPlanningYear />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
              <CardDescription>Recent History Activity</CardDescription>
            </CardHeader>
            <CardContent>
              <LogsPage />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
