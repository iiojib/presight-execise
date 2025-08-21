import { useEffect, useRef, useState } from "react";

const decoder = new TextDecoder("utf-8");

const read = async (
  reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
  callback: (text: string) => void,
  onDone: () => void,
) => {
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      onDone();
      break;
    }

    callback(decoder.decode(value));
  }
};

export type StreamPrinterProps = {
  stream?: ReadableStream<Uint8Array> | null | undefined;
};

export const StreamPrinter = ({ stream }: StreamPrinterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!stream) return () => {};

    const reader = stream.getReader();
    let buff: string[] = [];

    ref.current?.replaceChildren();

    read(reader, (char) => {
      buff.push(char);

      if (buff.length > 256) {
        const str = buff.join("");
        buff = [str];

        ref.current?.replaceChildren(document.createTextNode(str));
      } else {
        ref.current?.append(document.createTextNode(char));
      }
    }, () => {
      setContent(buff.join(''));
    });

    return () => {
      reader.cancel().catch(() => {/* ignore */});
    };
  }, [stream]);

  return <div ref={ref} className="whitespace-pre-wrap">{content}</div>;
};
