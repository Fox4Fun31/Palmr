"use client";

import { useEffect } from "react";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconEye,
  IconFile,
  IconFiles,
  IconLock,
  IconSettings,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateReverseShareBody } from "@/http/endpoints/reverse-shares/types";
import { ReverseShare } from "../hooks/use-reverse-shares";
import { FileSizeInput } from "./file-size-input";
import { FileTypesTagsInput } from "./file-types-tags-input";

// Constants
const DEFAULT_VALUES = {
  EMPTY_STRING: "",
  ZERO_STRING: "0",
  PAGE_LAYOUT: "DEFAULT" as const,
} as const;

const FORM_SECTIONS = {
  BASIC_INFO: "basicInfo",
  EXPIRATION: "expiration",
  FILE_LIMITS: "fileLimits",
  PASSWORD: "password",
} as const;

interface EditReverseShareFormData {
  name: string;
  description?: string;
  expiration?: string;
  maxFiles?: string;
  maxFileSize?: string;
  allowedFileTypes?: string;
  pageLayout?: "DEFAULT" | "WETRANSFER";
  hasExpiration: boolean;
  hasFileLimits: boolean;
  hasPassword: boolean;
  password?: string;
  isActive: boolean;
  noFilesLimit: boolean;
  noSizeLimit: boolean;
  allFileTypes: boolean;
}

interface EditReverseShareModalProps {
  reverseShare: ReverseShare | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReverseShare: (data: UpdateReverseShareBody) => Promise<any>;
  isUpdating: boolean;
}

export function EditReverseShareModal({
  reverseShare,
  isOpen,
  onClose,
  onUpdateReverseShare,
  isUpdating,
}: EditReverseShareModalProps) {
  const t = useTranslations();

  const form = useForm<EditReverseShareFormData>({
    defaultValues: getFormDefaultValues(),
  });

  const watchedValues = {
    hasExpiration: form.watch("hasExpiration"),
    hasFileLimits: form.watch("hasFileLimits"),
    noFilesLimit: form.watch("noFilesLimit"),
    noSizeLimit: form.watch("noSizeLimit"),
    allFileTypes: form.watch("allFileTypes"),
    hasPassword: form.watch("hasPassword"),
  };

  useEffect(() => {
    if (reverseShare) {
      form.reset(mapReverseShareToFormData(reverseShare));
    }
  }, [reverseShare, form]);

  const handleSubmit = async (data: EditReverseShareFormData) => {
    if (!reverseShare) return;

    try {
      const payload = buildUpdatePayload(data, reverseShare.id);
      await onUpdateReverseShare(payload);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[650px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit size={20} />
            {t("reverseShares.modals.edit.title")}
          </DialogTitle>
          <DialogDescription>{t("reverseShares.modals.edit.description")}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-140px)] py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <BasicInfoSection form={form} t={t} />
              <Separator />
              <ExpirationSection form={form} t={t} hasExpiration={watchedValues.hasExpiration} />
              <Separator />
              <FileLimitsSection
                form={form}
                t={t}
                hasFileLimits={watchedValues.hasFileLimits}
                noFilesLimit={watchedValues.noFilesLimit}
                noSizeLimit={watchedValues.noSizeLimit}
                allFileTypes={watchedValues.allFileTypes}
              />
              <Separator />
              <PasswordSection form={form} t={t} hasPassword={watchedValues.hasPassword} />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">⠋</div>
                      {t("reverseShares.modals.edit.updating")}
                    </div>
                  ) : (
                    t("reverseShares.modals.edit.saveChanges")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getFormDefaultValues(): EditReverseShareFormData {
  return {
    name: DEFAULT_VALUES.EMPTY_STRING,
    description: DEFAULT_VALUES.EMPTY_STRING,
    expiration: DEFAULT_VALUES.EMPTY_STRING,
    maxFiles: DEFAULT_VALUES.EMPTY_STRING,
    maxFileSize: DEFAULT_VALUES.EMPTY_STRING,
    allowedFileTypes: DEFAULT_VALUES.EMPTY_STRING,
    pageLayout: DEFAULT_VALUES.PAGE_LAYOUT,
    hasExpiration: false,
    hasFileLimits: false,
    hasPassword: false,
    password: DEFAULT_VALUES.EMPTY_STRING,
    isActive: true,
    noFilesLimit: true,
    noSizeLimit: true,
    allFileTypes: true,
  };
}

function mapReverseShareToFormData(reverseShare: ReverseShare): EditReverseShareFormData {
  const maxFilesValue = reverseShare.maxFiles?.toString() || DEFAULT_VALUES.ZERO_STRING;
  const maxFileSizeValue = reverseShare.maxFileSize?.toString() || DEFAULT_VALUES.ZERO_STRING;
  const allowedFileTypesValue = reverseShare.allowedFileTypes || DEFAULT_VALUES.EMPTY_STRING;
  const expirationValue = reverseShare.expiration
    ? new Date(reverseShare.expiration).toISOString().slice(0, 16)
    : DEFAULT_VALUES.EMPTY_STRING;

  return {
    name: reverseShare.name || DEFAULT_VALUES.EMPTY_STRING,
    description: reverseShare.description || DEFAULT_VALUES.EMPTY_STRING,
    expiration: expirationValue,
    maxFiles: maxFilesValue,
    maxFileSize: maxFileSizeValue,
    allowedFileTypes: allowedFileTypesValue,
    pageLayout: (reverseShare.pageLayout as "DEFAULT" | "WETRANSFER") || DEFAULT_VALUES.PAGE_LAYOUT,
    hasExpiration: false,
    hasFileLimits: false,
    hasPassword: false,
    password: DEFAULT_VALUES.EMPTY_STRING,
    isActive: reverseShare.isActive,
    noFilesLimit: !reverseShare.maxFiles,
    noSizeLimit: !reverseShare.maxFileSize,
    allFileTypes: !reverseShare.allowedFileTypes,
  };
}

function buildUpdatePayload(data: EditReverseShareFormData, id: string): UpdateReverseShareBody {
  const payload: UpdateReverseShareBody = {
    id,
    name: data.name,
    pageLayout: data.pageLayout || DEFAULT_VALUES.PAGE_LAYOUT,
    isActive: data.isActive,
  };

  // Add optional fields
  if (data.description?.trim()) {
    payload.description = data.description.trim();
  }

  // Handle expiration
  if (data.hasExpiration && data.expiration) {
    payload.expiration = new Date(data.expiration).toISOString();
  } else if (!data.hasExpiration) {
    payload.expiration = undefined;
  }

  // Handle file limits
  if (data.hasFileLimits) {
    payload.maxFiles = parsePositiveIntegerOrNull(data.maxFiles);
    payload.maxFileSize = parsePositiveIntegerOrNull(data.maxFileSize);
  } else {
    payload.maxFiles = null;
    payload.maxFileSize = null;
  }

  // Handle allowed file types
  payload.allowedFileTypes = data.allowedFileTypes?.trim() || null;

  // Handle password
  if (data.hasPassword && data.password) {
    payload.password = data.password;
  } else if (!data.hasPassword) {
    payload.password = undefined;
  }

  return payload;
}

function parsePositiveIntegerOrNull(value?: string): number | null {
  if (!value || value === DEFAULT_VALUES.ZERO_STRING) return null;
  const parsed = parseInt(value);
  return parsed > 0 ? parsed : null;
}

function createToggleButton(isExpanded: boolean, onToggle: () => void, icon: React.ReactNode, label: string) {
  return (
    <div className="flex items-center gap-1">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
        {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
      </Button>
    </div>
  );
}

function createLimitCheckbox(id: string, checked: boolean, onChange: (checked: boolean) => void, label: string) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(checked) => onChange(!!checked)} />
      <label htmlFor={id} className="text-sm text-muted-foreground cursor-pointer">
        {label}
      </label>
    </div>
  );
}

// Section Components
function BasicInfoSection({ form, t }: { form: any; t: any }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        rules={{ required: t("validation.required") }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("reverseShares.form.name.label")}</FormLabel>
            <FormControl>
              <Input placeholder={t("reverseShares.form.name.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("reverseShares.form.description.label")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("reverseShares.form.description.placeholder")} rows={3} {...field} />
            </FormControl>
            <FormDescription className="text-xs">{t("reverseShares.form.description.description")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pageLayout"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <IconSettings size={16} />
              {t("reverseShares.form.pageLayout.label")}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("reverseShares.form.pageLayout.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DEFAULT">{t("reverseShares.form.pageLayout.options.default")}</SelectItem>
                <SelectItem value="WETRANSFER">{t("reverseShares.form.pageLayout.options.wetransfer")}</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs">{t("reverseShares.form.pageLayout.description")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>{t("reverseShares.form.status.label")}</FormLabel>
              <FormDescription className="text-xs">{t("reverseShares.form.status.description")}</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

function ExpirationSection({ form, t, hasExpiration }: { form: any; t: any; hasExpiration: boolean }) {
  const toggleExpiration = () => {
    const newValue = !hasExpiration;
    form.setValue("hasExpiration", newValue);
    if (!newValue) {
      form.setValue("expiration", DEFAULT_VALUES.EMPTY_STRING);
    }
  };

  return (
    <div className="space-y-4">
      {createToggleButton(
        hasExpiration,
        toggleExpiration,
        <IconCalendar size={16} />,
        t("reverseShares.form.expiration.configure")
      )}

      {hasExpiration && (
        <FormField
          control={form.control}
          name="expiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reverseShares.form.expiration.label")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription className="text-xs">{t("reverseShares.form.expiration.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

function FileLimitsSection({
  form,
  t,
  hasFileLimits,
  noFilesLimit,
  noSizeLimit,
  allFileTypes,
}: {
  form: any;
  t: any;
  hasFileLimits: boolean;
  noFilesLimit: boolean;
  noSizeLimit: boolean;
  allFileTypes: boolean;
}) {
  const toggleFileLimits = () => {
    const newValue = !hasFileLimits;
    form.setValue("hasFileLimits", newValue);
    if (!newValue) {
      form.setValue("maxFiles", DEFAULT_VALUES.ZERO_STRING);
      form.setValue("maxFileSize", DEFAULT_VALUES.ZERO_STRING);
      form.setValue("allowedFileTypes", DEFAULT_VALUES.EMPTY_STRING);
    }
  };

  return (
    <div className="space-y-4">
      {createToggleButton(
        hasFileLimits,
        toggleFileLimits,
        <IconFile size={16} />,
        t("reverseShares.form.fileLimits.configure")
      )}

      {hasFileLimits && (
        <div className="space-y-4">
          {/* Max Files Field */}
          <FormField
            control={form.control}
            name="maxFiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconEye size={16} />
                  {t("reverseShares.form.maxFiles.label")}
                </FormLabel>
                <div className="space-y-3">
                  {createLimitCheckbox(
                    "no-files-limit-edit",
                    noFilesLimit,
                    (checked) => {
                      form.setValue("noFilesLimit", checked);
                      if (checked) field.onChange(DEFAULT_VALUES.ZERO_STRING);
                    },
                    t("reverseShares.labels.noFilesLimit")
                  )}
                  {!noFilesLimit && (
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder={t("reverseShares.form.maxFiles.placeholder")}
                        {...field}
                      />
                    </FormControl>
                  )}
                </div>
                <FormDescription className="text-xs">{t("reverseShares.form.maxFiles.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max File Size Field */}
          <FormField
            control={form.control}
            name="maxFileSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconFiles size={16} />
                  {t("reverseShares.form.maxFileSize.label")}
                </FormLabel>
                <div className="space-y-3">
                  {createLimitCheckbox(
                    "no-size-limit-edit",
                    noSizeLimit,
                    (checked) => {
                      form.setValue("noSizeLimit", checked);
                      if (checked) field.onChange(DEFAULT_VALUES.ZERO_STRING);
                    },
                    t("reverseShares.labels.noSizeLimit")
                  )}
                  {!noSizeLimit && (
                    <FormControl>
                      <FileSizeInput
                        value={field.value || DEFAULT_VALUES.EMPTY_STRING}
                        onChange={field.onChange}
                        placeholder={t("reverseShares.form.maxFileSize.placeholder")}
                      />
                    </FormControl>
                  )}
                </div>
                <FormDescription className="text-xs">{t("reverseShares.form.maxFileSize.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Allowed File Types Field */}
          <FormField
            control={form.control}
            name="allowedFileTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("reverseShares.form.allowedFileTypes.label")}</FormLabel>
                <div className="space-y-3">
                  {createLimitCheckbox(
                    "all-file-types-edit",
                    allFileTypes,
                    (checked) => {
                      form.setValue("allFileTypes", checked);
                      if (checked) field.onChange(DEFAULT_VALUES.EMPTY_STRING);
                    },
                    t("reverseShares.labels.allFileTypes")
                  )}
                  {!allFileTypes && (
                    <FormControl>
                      <FileTypesTagsInput
                        value={field.value ? field.value.split(",").filter(Boolean) : []}
                        onChange={(tags) => field.onChange(tags.join(","))}
                        placeholder="jpg png pdf docx"
                      />
                    </FormControl>
                  )}
                </div>
                <FormDescription className="text-xs">{t("reverseShares.labels.fileTypesHelp")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}

function PasswordSection({ form, t, hasPassword }: { form: any; t: any; hasPassword: boolean }) {
  const togglePassword = () => {
    const newValue = !hasPassword;
    form.setValue("hasPassword", newValue);
    if (!newValue) {
      form.setValue("password", DEFAULT_VALUES.EMPTY_STRING);
    }
  };

  return (
    <div className="space-y-4">
      {createToggleButton(
        hasPassword,
        togglePassword,
        <IconLock size={16} />,
        t("reverseShares.form.password.configurePassword")
      )}

      {hasPassword && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reverseShares.modals.password.password")}</FormLabel>
              <FormControl>
                <Input placeholder={t("reverseShares.form.password.passwordPlaceholder")} {...field} />
              </FormControl>
              <FormDescription className="text-xs">{t("reverseShares.form.password.passwordHelp")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
