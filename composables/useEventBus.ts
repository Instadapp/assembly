import { onBeforeUnmount } from "@nuxtjs/composition-api";
import { TinyEmitter } from "tiny-emitter";

const eventEmitter = new TinyEmitter();

export default function useEventBus() {
  const eventHandlers = [];

  onBeforeUnmount(() =>
    eventHandlers.forEach(eventHandler =>
      eventEmitter.off(eventHandler.event, eventHandler.handler)
    )
  );

  return {
    onEvent(event, handler) {
      eventHandlers.push({ event, handler });
      eventEmitter.on(event, handler);
    },
    emitEvent(event, payload) {
      eventEmitter.emit(event, payload);
    }
  };
}
