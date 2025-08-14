import { defineComponent, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function useConfirm() {
  const isOpen = ref(false);
  const resolveFn = ref(null);
  const title = ref("Are you sure?");
  const description = ref("This action cannot be undone.");

  const confirm = (options) => {
    if (options?.title) title.value = options.title;
    if (options?.description) description.value = options.description;
    isOpen.value = true;
    return new Promise((resolve) => {
      resolveFn.value = resolve;
    });
  };

  const ConfirmDialog = defineComponent({
    setup() {
      const onConfirm = () => {
        if (resolveFn.value) {
          resolveFn.value(true);
          isOpen.value = false;
        }
      };

      const onCancel = () => {
        if (resolveFn.value) {
          resolveFn.value(false);
          isOpen.value = false;
        }
      };

      return {
        isOpen,
        title,
        description,
        onConfirm,
        onCancel,
      };
    },
    render() {
      return this.$slots.default
        ? this.$slots.default()
        : h(
            Dialog,
            {
              open: this.isOpen,
              "onUpdate:open": (val) => (this.isOpen = val),
            },
            {
              default: () =>
                h(DialogContent, null, [
                  h(DialogHeader, null, [
                    h(DialogTitle, null, this.title),
                    h(DialogDescription, null, this.description),
                  ]),
                  h(DialogFooter, null, [
                    h(
                      Button,
                      {
                        variant: "outline",
                        onClick: this.onCancel,
                      },
                      "Cancel"
                    ),
                    h(
                      Button,
                      {
                        variant: "destructive",
                        onClick: this.onConfirm,
                      },
                      "Confirm"
                    ),
                  ]),
                ]),
            }
          );
    },
  });

  return { ConfirmDialog, confirm };
}
