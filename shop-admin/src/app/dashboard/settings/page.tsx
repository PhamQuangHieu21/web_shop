import ChangePasswordTab from "@/components/settings/change-password-tab";
import AccountInfoTab from "@/components/settings/account-info-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <main className="container max-w-4xl mx-auto px-4">
      <p className="text-2xl mb-5">Cài đặt người dùng</p>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Thông tin tài khoản</TabsTrigger>
          <TabsTrigger value="password">Mật khẩu</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountInfoTab />
        </TabsContent>
        <TabsContent value="password">
          <ChangePasswordTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
