import { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import {
  AlertCircleIcon,
  Archive,
  Edit,
  Lock,
  Trash2,
} from 'lucide-react-native';
// import { DateTime } from 'luxon';
import * as Yup from 'yup';

import { ActionSheetDropdown } from '@/components/app/ActionSheetDropdown';
import { CustomPageView } from '@/components/app/CustomPageView';
import { ImagePicker } from '@/components/app/ImagePicker';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { NOTE_STATUS } from '@/constants/Enumeration';
import { uploadImage } from '@/services/ImageService';
import {
  createNote,
  deleteNote,
  getNote,
  updateNote,
} from '@/services/NotesService';
import { useAuthStore } from '@/store/authStore';

const STATUS_SHEET_ITEMS = [
  {
    label: NOTE_STATUS.ACTIVE,
    value: NOTE_STATUS.ACTIVE,
    icon: Edit,
  },
  {
    label: NOTE_STATUS.LOCKED,
    value: NOTE_STATUS.LOCKED,
    icon: Lock,
  },
  {
    label: NOTE_STATUS.ARCHIVED,
    value: NOTE_STATUS.ARCHIVED,
    icon: Archive,
  },
];

const Note = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const isCreate = noteId === '0';
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik<{
    title: string;
    content: string;
    status: string;
    imageUrl: string | null;
  }>({
    initialValues: {
      title: '',
      content: '',
      status: '',
      imageUrl: null,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
      status: Yup.string().required('Status is required'),
      imageUrl: Yup.string().nullable(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      if (isCreate) {
        createNote(user.userId, values)
          .then(() => router.push(`/notes`))
          .finally(() => setSubmitting(false));
      } else {
        updateNote(user.userId, noteId, values)
          .then(() => router.push(`/notes`))
          .finally(() => setSubmitting(false));
      }
    },
  });

  const handleDeleteNote = () => {
    setShowDeleteDialog(false);
    deleteNote(user.userId, noteId).then(() => {
      router.push(`/notes`);
    });
  };

  const handleUploadImage = async (value: string | null) => {
    if (value) {
      setImageLoading(true);
      const formData = new FormData();
      const imageData = {
        uri: value,
        type: `image/${value.substring(value.lastIndexOf('.') + 1)}`,
        name: value.substring(value.lastIndexOf('/') + 1, value.length),
      };
      formData.append('image', imageData as unknown as Blob);

      uploadImage(user.userId, formData)
        .then((data) => {
          setFieldValue('imageUrl', data.url);
        })
        .finally(() => setImageLoading(false));
    }
  };

  const getData = () => {
    setLoading(true);
    getNote(user.userId, noteId)
      .then((data) => {
        setValues(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isCreate) {
      getData();
    }
  }, []);

  return (
    <CustomPageView
      loading={loading}
      title={isCreate ? 'New Note' : 'Edit Note'}
      action={
        !isCreate && (
          <Button
            className="mx-2"
            size="sm"
            variant="link"
            action="primary"
            onPress={() => setShowDeleteDialog(true)}
          >
            <ButtonIcon as={Trash2} />
          </Button>
        )
      }
      footer={
        <Button
          className="mx-4 mb-8 rounded-full"
          size="md"
          variant="solid"
          action="primary"
          onPress={() => handleSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ?
            <ButtonSpinner />
          : <ButtonText>Save</ButtonText>}
        </Button>
      }
    >
      <VStack space="lg" className="flex-1 p-4 w-full">
        <FormControl
          isInvalid={!!errors.title && touched.title}
          isDisabled={isSubmitting || values.status === NOTE_STATUS.LOCKED}
        >
          <FormControlLabel>
            <FormControlLabelText>Title</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Enter title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.title}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          isInvalid={!!errors.status && touched.status}
          isDisabled={isSubmitting}
          isReadOnly={true}
        >
          <FormControlLabel>
            <FormControlLabelText>Status</FormControlLabelText>
          </FormControlLabel>
          <ActionSheetDropdown
            placeholder="Select status"
            value={values.status}
            items={STATUS_SHEET_ITEMS}
            onChange={(status) => setFieldValue('status', status)}
          />
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.status}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          isInvalid={!!errors.content && touched.content}
          isDisabled={isSubmitting || values.status === NOTE_STATUS.LOCKED}
        >
          <FormControlLabel>
            <FormControlLabelText>Content</FormControlLabelText>
          </FormControlLabel>
          <Textarea size="md">
            <TextareaInput
              placeholder="Enter content"
              value={values.content}
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
            />
          </Textarea>
          <FormControlError>
            <FormControlErrorIcon size="xs" as={AlertCircleIcon} />
            <FormControlErrorText size="xs">
              {errors.content}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <ImagePicker
          loading={imageLoading}
          value={values.imageUrl}
          onChange={(value) => handleUploadImage(value)}
        />
      </VStack>

      <AlertDialog isOpen={showDeleteDialog} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete this note?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the note will remove it permanently and cannot be undone.
              Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              size="sm"
              variant="outline"
              action="secondary"
              onPress={() => setShowDeleteDialog(false)}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={() => handleDeleteNote()}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CustomPageView>
  );
};

export default Note;
