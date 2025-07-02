// import React, { useState } from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import {
  asyncGetProductStandard,
  asyncAddProductStandard,
  asyncUpdateProductStandard,
  asyncDeleteProductStandard,
} from "@/store/productStandard/action";
import { useParams } from "react-router-dom";

// Daftar field valid dan label yang lebih enak dibaca
const VALID_FIELDS = [
  "colorDeltaL",
  "colorDeltaA",
  "colorDeltaB",
  "colorDeltaE",
  "tintDeltaL",
  "tintDeltaA",
  "tintDeltaB",
  "tintDeltaE",
  "density",
  "mfr",
  "dispersion",
  "contamination",
  "macaroni",
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "moisture",
  "carbonContent",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "qcJudgment",
  "analysisDate",
  "caCO3",
  "odor",
  "nucleatingAgent",
  "hals",
  "hiding",
];

const FIELD_LABELS = {
  colorDeltaL: "Color ΔL",
  colorDeltaA: "Color ΔA",
  colorDeltaB: "Color ΔB",
  colorDeltaE: "Color ΔE",
  tintDeltaL: "Tint ΔL",
  tintDeltaA: "Tint ΔA",
  tintDeltaB: "Tint ΔB",
  tintDeltaE: "Tint ΔE",
  density: "Density",
  mfr: "MFR",
  dispersion: "Dispersion",
  contamination: "Contamination",
  macaroni: "Macaroni",
  pelletLength: "Pellet Length",
  pelletDiameter: "Pellet Diameter",
  visualCheck: "Visual Check",
  moisture: "Moisture Content",
  carbonContent: "Carbon Content",
  foreignMatter: "Foreign Matter",
  weightOfChips: "Weight of Chips",
  intrinsicViscosity: "Intrinsic Viscosity",
  ashContent: "Ash Content",
  heatStability: "Heat Stability",
  lightFastness: "Light Fastness",
  granule: "Granule",
  qcJudgment: "QC Judgment",
  analysisDate: "Analysis Date",
  caCO3: "CaCO3",
  odor: "Odor",
  nucleatingAgent: "Nucleating Agent",
  hals: "Hals",
  hiding: "Hiding",
};

// Enum Operator
const Operator = {
  PLUS_MINUS: "PLUS_MINUS",
  LESS_THAN: "LESS_THAN",
  LESS_EQUAL: "LESS_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  GREATER_EQUAL: "GREATER_EQUAL",
};

const operatorLabel = {
  [Operator.PLUS_MINUS]: "±",
  [Operator.LESS_THAN]: "<",
  [Operator.LESS_EQUAL]: "≤",
  [Operator.GREATER_THAN]: ">",
  [Operator.GREATER_EQUAL]: "≥",
};

export default function ProductStandard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { standards, loading, error, productInfo } = useSelector(
    (state) => state.productStandard
  );
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    property_name: "",
    target_value: "",
    tolerance: "",
    operator: "",
    unit: "",
  });
  const [deleteId, setDeleteId] = useState(null);

  console.log(standards);

  const filtered = standards.filter((item) =>
    item.property_name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter field yang sudah dipakai, kecuali jika sedang edit, property yang sedang diedit tetap muncul
  const usedFields = standards.map((item) => item.property_name);
  const availableFields = editItem
    ? VALID_FIELDS.filter(
        (field) =>
          !usedFields.includes(field) || field === editItem.property_name
      )
    : VALID_FIELDS.filter((field) => !usedFields.includes(field));

  useEffect(() => {
    dispatch(asyncGetProductStandard(id));
  }, [dispatch, id]);

  const handleOpenAdd = () => {
    setEditItem(null);
    setForm({
      property_name: "",
      target_value: "",
      tolerance: "",
      operator: "",
      unit: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setForm({
      property_name: item.property_name,
      target_value: item.target_value,
      tolerance: item.tolerance ?? "",
      operator: item.operator,
      unit: item.unit,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const productId = parseInt(id);

    if (editItem) {
      // Update existing standard
      dispatch(
        asyncUpdateProductStandard(editItem.id, {
          ...form,
          product_id: productId,
          target_value: Number(form.target_value),
          tolerance: form.tolerance === "" ? null : Number(form.tolerance),
        })
      );
    } else {
      // Add new standard
      dispatch(
        asyncAddProductStandard({
          ...form,
          product_id: productId,
          target_value: Number(form.target_value),
          tolerance: form.tolerance === "" ? null : Number(form.tolerance),
        })
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    const productId = parseInt(id);
    dispatch(asyncDeleteProductStandard(deleteId, productId));
    setDeleteId(null);
  };

  const cancelDelete = () => setDeleteId(null);

  return (
    <Card className="w-full mx-auto mt-10">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Standar Produk</CardTitle>
            <CardDescription>
              Detail standar untuk produk berikut.
            </CardDescription>
            <div className="mt-2 text-sm">
              <strong>Nama Produk:</strong> {productInfo?.productName || "-"}{" "}
              <br />
              <strong>Resin:</strong> {productInfo?.resin || "-"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari properti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleOpenAdd} className="">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Standard
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Properti</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Toleransi</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {FIELD_LABELS[item.property_name] || item.property_name}
                  </TableCell>
                  <TableCell>{item.target_value}</TableCell>
                  <TableCell>
                    {item.tolerance !== null ? item.tolerance : "-"}
                  </TableCell>
                  <TableCell>
                    {operatorLabel[item.operator] || item.operator}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="flex justify-end">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Modal Add/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold mb-4">
                {editItem ? "Edit Standard" : "Add Standard"}
              </h3>
              <div className="mb-2">
                <label className="block text-sm mb-1">Properti</label>
                <select
                  name="property_name"
                  value={form.property_name}
                  onChange={handleFormChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Pilih Properti</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>
                      {FIELD_LABELS[field] || field}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Target</label>
                <Input
                  name="target_value"
                  type="number"
                  value={form.target_value}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Toleransi</label>
                <Input
                  name="tolerance"
                  type="number"
                  value={form.tolerance}
                  onChange={handleFormChange}
                  placeholder="Boleh kosong"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Operator</label>
                <select
                  name="operator"
                  value={form.operator}
                  onChange={handleFormChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Pilih Operator</option>
                  <option value={Operator.LESS_EQUAL}>≤</option>
                  <option value={Operator.LESS_THAN}>&lt;</option>
                  <option value={Operator.PLUS_MINUS}>±</option>
                  <option value={Operator.GREATER_THAN}>&gt;</option>
                  <option value={Operator.GREATER_EQUAL}>≥</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Satuan</label>
                <Input
                  name="unit"
                  value={form.unit}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        )}

        {/* Konfirmasi Delete */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
              <p className="mb-4">
                Apakah Anda yakin ingin menghapus standar ini?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelDelete}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
