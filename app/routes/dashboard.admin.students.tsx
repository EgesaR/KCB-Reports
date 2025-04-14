import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminHeader from '~/components/admin/AdminHeader';
import DataTable from '~/components/admin/DataTable';
import FormModal from '~/components/admin/FormModal';
import { prisma } from '~/utils/prisma.server';
import { requireUserId } from '~/utils/session.server';
import type { Student } from '~/types';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

interface ActionResponse {
  success?: boolean;
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const [students, classes] = await Promise.all([
    prisma.student.findMany({
      select: {
        id: true,
        name: true,
        studentId: true,
        classId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);
  return json({ students, classes });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'create':
      try {
        const classId = formData.get('classId') as string;
        const classExists = await prisma.class.findUnique({ where: { id: Number(classId) } });
        if (!classExists) throw new Error('Invalid class ID');
        await prisma.student.create({
          data: {
            name: formData.get('name') as string,
            studentId: formData.get('studentId') as string,
            classId,
          },
        });
        return json({ success: true });
      } catch (error) {
        return json({ error: 'Failed to create student. Ensure Student ID is unique.' }, { status: 400 });
      }
    case 'update':
      try {
        const classId = formData.get('classId') as string;
        const classExists = await prisma.class.findUnique({ where: { id: Number(classId) } });
        if (!classExists) throw new Error('Invalid class ID');
        await prisma.student.update({
          where: { id: formData.get('id') as string },
          data: {
            name: formData.get('name') as string,
            studentId: formData.get('studentId') as string,
            classId,
            updatedAt: new Date(),
          },
        });
        return json({ success: true });
      } catch (error) {
        return json({ error: 'Failed to update student. Ensure Student ID is unique.' }, { status: 400 });
      }
    case 'delete':
      try {
        await prisma.student.delete({
          where: { id: formData.get('id') as string },
        });
        return json({ success: true });
      } catch (error) {
        return json({ error: 'Failed to delete student.' }, { status: 400 });
      }
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
}

export default function Students() {
  const { students, classes } = useLoaderData<{
    students: Student[];
    classes: { id: number; name: string }[];
  }>();
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        setNotification({ message: 'Operation successful!', type: 'success' });
      } else if (fetcher.data.error) {
        setNotification({ message: fetcher.data.error, type: 'error' });
      }
      setIsModalOpen(false);
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [fetcher.data]);

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    fetcher.submit({ intent: 'delete', id: student.id }, { method: 'post' });
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <AdminHeader title="Manage Students" onAdd={handleAdd} />
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.input
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search students..."
        className="mb-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredStudents.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400 text-center py-8"
          >
            No students found.
          </motion.p>
        ) : (
          <DataTable
            data={filteredStudents}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'studentId', label: 'Student ID' },
              {
                key: 'classId',
                label: 'Class',
                render: (value: string) => {
                  const cls = classes.find((c) => c.id.toString() === value);
                  return cls ? cls.name : value;
                },
              },
              {
                key: 'createdAt',
                label: 'Created At',
                render: (value: string) => new Date(value).toLocaleDateString(),
              },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </motion.div>
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add Student'}
        fields={[
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter student name' },
          { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'e.g., STU123' },
          {
            name: 'classId',
            label: 'Class',
            type: 'select',
            options: classes.map((cls) => ({
              value: cls.id.toString(),
              label: cls.name,
            })),
            placeholder: 'Select a class',
          },
        ]}
        initialData={selectedStudent ?? undefined}
        action="/dashboard/admin/students"
      />
    </div>
  );
}