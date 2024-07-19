import React from 'react'
import { Head ,Link} from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout'

export default function Home() {
  return (
      <ClientLayout>
          <Head title="Home" />
          <div className="py-12">
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                      <div className="p-6 text-gray-900 dark:text-gray-100">
                          Home
                      </div>
                      <Link href={route("login")}>Login</Link>
                  </div>
              </div>
          </div>
      </ClientLayout>
  );
}