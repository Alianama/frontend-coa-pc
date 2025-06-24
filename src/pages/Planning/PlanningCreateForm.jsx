import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncCreatePlanning,
  asyncUpdatePlanning,
  asyncGetPlanning,
} from "@/store/planning/action";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combo-box";
import { asyncGetCustomer } from "@/store/customer/action";
import { asyncGetProduct } from "@/store/product/action";

export default function PlanningCreateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isUpdate = Boolean(params.id);

  // Gunakan camelCase untuk semua key di formData
  const [formData, setFormData] = useState({
    idCustomer: "",
    idProduct: "",
    resin: "",
    ratio: "",
    moulding: "",
    lotNumber: "",
    qtyPlanning: "",
    mfgDate: null,
    expiryDate: null,
  });

  const customers = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(asyncGetCustomer());
    dispatch(asyncGetProduct());
    if (isUpdate) {
      dispatch(asyncGetPlanning()).then((res) => {
        const found = res?.data?.find((p) => p.id?.toString() === params.id);
        if (found) {
          setFormData({
            ...found,
            mfgDate: found.mfgDate ? new Date(found.mfgDate) : null,
            expiryDate: found.expiryDate ? new Date(found.expiryDate) : null,
          });
        }
      });
    }
  }, [isUpdate, params.id, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleProductChange = (value) => {
    const selectedProduct = products?.find(
      (product) => product.id.toString() === value
    );
    setFormData((prev) => ({
      ...prev,
      idProduct: value,
      resin: selectedProduct?.resin || "",
      ratio: selectedProduct?.letDownRatio || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        idCustomer: Number(formData.idCustomer),
        idProduct: Number(formData.idProduct),
        resin: formData.resin,
        ratio: formData.ratio,
        moulding: formData.moulding,
        lotNumber: formData.lotNumber,
        qtyPlanning: Number(formData.qtyPlanning),
        mfgDate: formData.mfgDate ? formData.mfgDate.toISOString() : null,
        expiryDate: formData.expiryDate
          ? formData.expiryDate.toISOString()
          : null,
      };
      if (isUpdate) {
        await dispatch(asyncUpdatePlanning(params.id, payload));
      } else {
        await dispatch(asyncCreatePlanning(payload));
      }
      navigate("/planning");
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isUpdate ? "Update Planning" : "Tambah Planning"}
          </CardTitle>
          <CardDescription>
            Silakan isi data planning dengan lengkap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label>Customer</label>
                <Combobox
                  items={customers?.map((customer) => ({
                    value: customer.id.toString(),
                    label: customer.name,
                  }))}
                  value={formData.idCustomer?.toString()}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, idCustomer: value }));
                  }}
                  placeholder="Pilih customer..."
                  searchPlaceholder="Cari customer..."
                  emptyMessage="Customer tidak ditemukan."
                />
              </div>
              <div className="space-y-2">
                <label>Product</label>
                <Combobox
                  items={products?.map((product) => ({
                    value: product.id.toString(),
                    label: product.productName,
                  }))}
                  value={formData.idProduct?.toString()}
                  onValueChange={handleProductChange}
                  placeholder="Pilih produk..."
                  searchPlaceholder="Cari produk..."
                  emptyMessage="Produk tidak ditemukan."
                />
              </div>
              <div className="space-y-2">
                <label>Resin</label>
                <Input
                  name="resin"
                  value={formData.resin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label>Ratio</label>
                <Input
                  name="ratio"
                  value={formData.ratio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label>Moulding</label>
                <Input
                  name="moulding"
                  value={formData.moulding}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label>Lot No</label>
                <Input
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label>Qty Planning</label>
                <Input
                  name="qtyPlanning"
                  value={formData.qtyPlanning}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label>Mfg Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.mfgDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.mfgDate ? (
                        formData.mfgDate.toLocaleDateString()
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.mfgDate}
                      onSelect={handleDateChange("mfgDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label>Expiry Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? (
                        formData.expiryDate.toLocaleDateString()
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={handleDateChange("expiryDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
