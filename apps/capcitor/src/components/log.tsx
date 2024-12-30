import { createSignal, type Component, Show, For } from 'solid-js';

interface LogProps {}

const [logs, _setLogs] = createSignal<string[]>([]);
export const setLogs = _setLogs;

const Log: Component<LogProps> = (props) => {
  const [show, setShow] = createSignal(false);
  return (
    <Show
      when={show()}
      fallback={
        <div class="fixed top-20 left-5 z-[99]">
          <span class="btn btn-warning btn-xs">
            <i
              class="iconoir-code-brackets-square"
              onclick={() => {
                setShow(true);
              }}
            ></i>
          </span>
        </div>
      }
    >
      <div class="fixed left-0 right-0 top-0 bottom-0 z-[99] bg-gray-800 overflow-y-scroll">
        <div class="flex gap-10 px-5 pt-5">
          <span
            class="btn btn-warning btn-xs"
            onclick={() => {
              setShow(false);
            }}
          >
            <i class="iconoir-web-window-xmark"></i>
          </span>
          <span
            class="btn btn-warning btn-xs"
            onclick={() => {
              setLogs([]);
            }}
          >
            <i class="iconoir-refresh"></i>
          </span>
        </div>
        <div class="flex flex-col gap-2 text-sm p-2">
          <For each={logs()}>{(log) => <div class="box">{log}</div>}</For>
        </div>
      </div>
    </Show>
  );
};

export default Log;
