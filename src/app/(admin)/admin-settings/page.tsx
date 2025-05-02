"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { useToast } from "@/contexts/ToastContext";
import { useFeedback } from "@/contexts/FeedbackContext";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: "Minha Loja",
    maintenanceMode: false,
    taxRate: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { showFeedback } = useFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback("Salvando configurações...", true);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast("Configurações salvas com sucesso", "success");
      showFeedback("", false);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="nc-AdminSettingsPage">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold">Configurações do Sistema</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Site
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Taxa de Imposto (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({ ...settings, taxRate: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label
                htmlFor="maintenanceMode"
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
              >
                Modo Manutenção
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <ButtonPrimary type="submit" loading={isLoading}>
              Salvar Configurações
            </ButtonPrimary>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;
