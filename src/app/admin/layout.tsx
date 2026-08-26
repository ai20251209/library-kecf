import React from 'react';
import AdminGuard from '@/components/AdminGuard';

export const metadata = {
  title: '사서 관리자 LMS | 별빛 북스페이스',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
