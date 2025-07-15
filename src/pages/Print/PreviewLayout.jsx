import Template2 from "./Template/TampletePrint-2";
import Template1 from "./Template/TemplatePrint-1";
import { Button } from "@/components/ui/button";
import {
  asyncGetPrintByID,
  asyncApprovePrintCoa,
  asyncRejectPrintCoa,
} from "@/store/print/action";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { Printer } from "lucide-react";

// Komponen badge status sederhana
const StatusBadge = ({ status }) => {
  const statusMap = {
    APPROVED: {
      text: "Approved",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      text: "Rejected",
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    REQUESTED: {
      text: "Requested",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
  };
  const { text, bg, dot } = statusMap[status] || statusMap.REQUESTED;
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bg}`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${dot}`} />
      {text}
    </div>
  );
};

// Tambahkan validasi props
StatusBadge.propTypes = {
  status: PropTypes.string,
};

const PreviewComponent = () => {
  const [tab, setTab] = useState("template1");
  const componentRef1 = useRef(null);
  const componentRef2 = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const detail = useSelector((state) => state.prints.detail);
  const authUser = useSelector((state) => state.authUser);

  // State untuk dialog konfirmasi
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [loading, setLoading] = useState(false);

  const status = detail?.status;
  const isAdmin =
    authUser?.role?.name === "ADMIN" || authUser?.role?.name === "SUPER_ADMIN";

  // Cek apakah status APPROVED
  const isApproved = detail?.status === "APPROVED";
  const isRequested = detail?.status === "REQUESTED";

  // Event listener Ctrl+P: jika APPROVED, shortcut akan navigate ke halaman print
  useEffect(() => {
    if (!isApproved) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate(`/print/print/${id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isApproved, navigate, id]);

  useEffect(() => {
    dispatch(asyncGetPrintByID(id));
  }, [id, dispatch]);

  // Handler buka dialog
  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  // Handler konfirmasi dialog
  const handleDialogConfirm = async () => {
    setLoading(true);
    try {
      if (dialogType === "approve") {
        await dispatch(asyncApprovePrintCoa(id));
      } else if (dialogType === "reject") {
        await dispatch(asyncRejectPrintCoa(id));
      }
      setDialogOpen(false);
      navigate("/coa-history");
    } catch {
      // Bisa tambahkan notifikasi error
      setDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      {/* Header status dan tabs */}
      <title>QC - Print Preview</title>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-2 flex-col">
          <div className="flex flex-row gap-4">
            <h2 className="text-xl font-bold">Preview COA</h2>
            {status && <StatusBadge status={status} />}
          </div>
          <div className="flex gap-5">
            <h1 className="text-sm">
              Created At:{" "}
              {detail?.createdAt
                ? new Date(detail.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </h1>
            <span className="border-l-1 border-black" />
            <h1 className="text-sm">Issued By : {detail?.issuedBy}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          {isAdmin && isRequested && (
            <>
              <Button
                variant="outline"
                className="bg-green-400"
                onClick={() => openDialog("approve")}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => openDialog("reject")}
              >
                Reject
              </Button>
            </>
          )}
          {isApproved && (
            <Button
              className="ml-5"
              onClick={() => navigate(`/print/print/${id}`)}
              title="Print dokumen ini"
            >
              <Printer /> CTRL + P
            </Button>
          )}
        </div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="template1">Template 1</TabsTrigger>
          <TabsTrigger value="template2">Template 2</TabsTrigger>
        </TabsList>
        <TabsContent value="template1">
          <div className="flex-1 min-w-[400px]  border shadow bg-white print-preview-template mx-auto">
            <Template1 data={detail} ref={componentRef1} />
          </div>
        </TabsContent>
        <TabsContent value="template2">
          <div className="flex-1 min-w-[400px]  border shadow bg-white print-preview-template mx-auto">
            <Template2 data={detail} ref={componentRef2} />
          </div>
        </TabsContent>
      </Tabs>
      {/* Dialog konfirmasi */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "approve"
                ? "Konfirmasi Approve"
                : "Konfirmasi Reject"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {dialogType === "approve"
              ? "Apakah Anda yakin ingin APPROVE data ini?"
              : "Apakah Anda yakin ingin REJECT data ini?"}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              variant={dialogType === "approve" ? "default" : "destructive"}
              onClick={handleDialogConfirm}
              disabled={loading}
            >
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Style print agar muat 1 halaman */}
      <style>{`
        @media print {
          .print-preview-template {
            min-width: 400px !important;
            max-width: 600px !important;
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default function PreviewLayout() {
  return (
    <Layout
      title="Preview COA"
      items={[
        { label: "Home", href: "/" },
        { label: "COA List", href: "/coa-history" },
      ]}
    >
      <PreviewComponent />
    </Layout>
  );
}
