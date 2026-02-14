"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/src/lib/api";
import { Edit, Plus, Trash2 } from "lucide-react";

type Address = {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
};

const emptyForm = {
  id: "",
  type: "Home",
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
} as const;

export default function DeliveryAddressPage() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const isEdit = useMemo(() => Boolean(form.id), [form.id]);

  const load = () => {
    setLoading(true);
    setError(null);
    apiFetch<{ success: boolean; data: Address[] }>("/api/v1/addresses")
      .then((res) => setAddresses(res.data || []))
      .catch((e: any) => setError(e?.message || "Failed to load addresses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setIsFormOpen(true);
  };

  const openEdit = (a: Address) => {
    setForm({
      id: a.id,
      type: a.type,
      name: a.name,
      address: a.address,
      city: a.city,
      state: a.state,
      zip: a.zip,
      phone: a.phone,
    });
    setIsFormOpen(true);
  };

  const submit = async () => {
    setError(null);
    if (!form.name || !form.address || !form.city || !form.state || !form.zip || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await apiFetch(`/api/v1/addresses/${form.id}`, {
          method: "PATCH",
          json: {
            type: form.type,
            name: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            phone: form.phone,
          },
        });
      } else {
        await apiFetch(`/api/v1/addresses`, {
          method: "POST",
          json: {
            type: form.type,
            name: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            phone: form.phone,
          },
        });
      }
      setIsFormOpen(false);
      setForm({ ...emptyForm });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/v1/addresses/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/v1/addresses/${id}/default`, { method: "POST" });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to set default");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Addresses</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your saved addresses.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit address" : "Add new address"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Type</Label>
                <Input value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Full name *</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Address *</Label>
              <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>State *</Label>
                <Input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>ZIP *</Label>
                <Input value={form.zip} onChange={(e) => setForm((p) => ({ ...p, zip: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  setForm({ ...emptyForm });
                }}
              >
                Cancel
              </Button>
              <Button disabled={saving} onClick={submit}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-gray-900">No address saved</p>
            <p className="text-sm text-gray-600 mt-1">Add an address and set one as default for checkout.</p>
            <Button className="mt-4" onClick={openCreate}>
              Add New
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{a.type}</Badge>
                    {a.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                  </div>
                  <h3 className="font-semibold text-gray-900">{a.name}</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-1">{a.address}</p>
              <p className="text-sm text-gray-600 mb-2">
                {a.city}, {a.state} {a.zip}
              </p>
              <p className="text-sm text-gray-600">{a.phone}</p>

              <div className="mt-3 flex space-x-2">
                {!a.isDefault ? (
                  <Button variant="outline" size="sm" className="text-xs flex-1" disabled={saving} onClick={() => setDefault(a.id)}>
                    Set Default
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-xs flex-1" disabled>
                    Default
                  </Button>
                )}
                <Button variant="outline" size="sm" disabled={saving} onClick={() => del(a.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
