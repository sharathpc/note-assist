import { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { AlertCircleIcon, Archive, Edit, Lock } from 'lucide-react-native';
import { DateTime } from 'luxon';
import * as Yup from 'yup';

import { CustomPageView } from '@/components/app/CustomPageView';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { NOTE_STATUS } from '@/constants/Enumeration';
import { createNote, getNote, updateNote } from '@/services/NotesService';
import { useAuthStore } from '@/store/authStore';

const Notes = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showStatusSheet, setShowStatusSheet] = useState(false);

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
  } = useFormik({
    initialValues: {
      title: '',
      content: '',
      status: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      if (noteId === '0') {
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

  const handleStatusSheet = (status: string) => {
    setFieldValue('status', status);
    setShowStatusSheet(false);
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
    if (noteId !== '0') {
      getData();
    }
  }, []);

  return (
    <CustomPageView
      title={noteId === '0' ? 'New Note' : 'Edit Note'}
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
          <Input>
            <InputField
              type="text"
              placeholder="Select status"
              value={values.status}
              onPress={() => setShowStatusSheet(true)}
            />
          </Input>
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
        <Actionsheet
          isOpen={showStatusSheet}
          onClose={() => setShowStatusSheet(false)}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem
              onPress={() => handleStatusSheet(NOTE_STATUS.ACTIVE)}
            >
              <ActionsheetIcon as={Edit} />
              <ActionsheetItemText>{NOTE_STATUS.ACTIVE}</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => handleStatusSheet(NOTE_STATUS.LOCKED)}
            >
              <ActionsheetIcon as={Lock} />
              <ActionsheetItemText>{NOTE_STATUS.LOCKED}</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => handleStatusSheet(NOTE_STATUS.ARCHIVED)}
            >
              <ActionsheetIcon as={Archive} />
              <ActionsheetItemText>{NOTE_STATUS.ARCHIVED}</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </VStack>
    </CustomPageView>
  );
};

export default Notes;
