import { useState, useEffect } from "react";
import { Search, Filter, Calendar, User, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetLogHistory } from "@/store/dashboard/action";

const getActionBadgeVariant = (action) => {
  switch (action) {
    case "CREATE":
      return "default";
    case "UPDATE":
      return "secondary";
    case "DELETE":
      return "destructive";
    case "LOGIN":
      return "outline";
    default:
      return "secondary";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export default function LogsPage() {
  const dispatch = useDispatch();
  const { logHistory, logHistoryPagination } = useSelector(
    (state) => state.dashboard
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Ambil data log history dari backend saat mount & filter berubah
  useEffect(() => {
    dispatch(
      asyncGetLogHistory({
        page: currentPage,
        limit: 50,
        action: actionFilter !== "all" ? actionFilter : undefined,
        search: searchTerm || undefined,
      })
    );
  }, [dispatch, currentPage, actionFilter, searchTerm]);

  const filteredLogs = logHistory || [];
  const uniqueActions = [...new Set(filteredLogs.map((log) => log.action))];
  const pagination = logHistoryPagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor and track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total: {pagination.total} logs
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter and search through system logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search logs, users, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {pagination.total} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[120px]">Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px]">User</TableHead>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No logs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        #{log.id}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={log.description}>
                          {log.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">
                              {log.user.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              @{log.user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}({pagination.total}{" "}
          total entries)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pagination.totalPages}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1)
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
