import type { ReactNode } from "react";
import _toast, { type ToastOptions } from "react-hot-toast";
import { ToastCustom } from "~/app/components/atoms/ToastCustom";

export type ToastMsg = {
  title?: string;
  description?: string;
  component?: React.ComponentType<any>;
};

export type ToastMsgs = {
  loading?: ToastMsg;
  success?: ToastMsg;
  info?: ToastMsg;
  error?: ToastMsg;
  warning?: ToastMsg;
};

const defaultMsgs = {
  loading: {
    title: "Loading...",
  } as ToastMsg,
  success: {
    title: "Operation Successful",
  } as ToastMsg,
  info: {
    title: "Info",
  } as ToastMsg,
  error: {
    title: "Error",
    description: "Something went wrong. Please try again later.",
  } as ToastMsg,
  warning: {
    title: "Warning",
    description: "Something happened",
  } as ToastMsg,
};

function success(toastMsg: ToastMsg = {}, options?: ToastOptions) {
  _toast.custom((t) => {
    const msg = { ...defaultMsgs.success, ...toastMsg };

    return (
      <ToastCustom
        close={() => _toast.dismiss(t.id)}
        title={msg.title as string}
        description={msg.description}
        component={msg.component}
        type="success"
      />
    );
  }, options);
}

const error = (toastMsg: ToastMsg = {}, options?: ToastOptions) =>
  _toast.custom((t) => {
    const msg = { ...defaultMsgs.error, ...toastMsg };
    return (
      <ToastCustom
        close={() => _toast.dismiss(t.id)}
        title={msg.title as string}
        description={msg.description}
        type="error"
      />
    );
  }, options);

const warning = (toastMsg: ToastMsg = {}, options?: ToastOptions) =>
  _toast.custom((t) => {
    const msg = { ...defaultMsgs.error, ...toastMsg };
    return (
      <ToastCustom
        close={() => _toast.dismiss(t.id)}
        title={msg.title as string}
        description={msg.description}
        type="warning"
      />
    );
  }, options);

const info = (toastMsg: ToastMsg = {}, options?: ToastOptions) =>
  _toast.custom((t) => {
    const msg = { ...defaultMsgs.error, ...toastMsg };
    return (
      <ToastCustom
        close={() => _toast.dismiss(t.id)}
        title={msg.title as string}
        description={msg.description}
        type="info"
      />
    );
  }, options);

const loading = (toastMsg: ToastMsg = {}, options?: ToastOptions) =>
  _toast.custom(
    (t) => {
      const msg = { ...defaultMsgs.loading, ...toastMsg };
      return (
        <ToastCustom
          close={() => _toast.dismiss(t.id)}
          title={msg.title as string}
          description={msg.description}
          type="loading"
        />
      );
    },
    { removeDelay: 0, ...options },
  );

const promise = async <T,>(promise: Promise<T>, toastMsgs: ToastMsgs = {}, delay?: number) => {
  const id = loading(
    { ...defaultMsgs.loading, ...toastMsgs?.loading },
    { duration: Number.POSITIVE_INFINITY, id: crypto.randomUUID() },
  );

  return promise
    .then(async (result) => {
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      if (toastMsgs?.success?.component) {
        const Component = toastMsgs.success.component;
        toastMsgs.success.component = Component;
      }
      const msg = { ...defaultMsgs.success, ...toastMsgs?.success };
      success(msg, { id, duration: 8000 });
      return result;
    })
    .catch((e) => {
      const msg = toastMsgs.error || { title: "Something went wrong", description: e };
      error(msg, { id, duration: 8000 });
      throw e;
    });
};

export const toast = {
  promise,
  success,
  info,
  error,
  dismiss: _toast.dismiss,
  loading,
  warning,
};

export const useToast = () => {
  return { toast };
};
