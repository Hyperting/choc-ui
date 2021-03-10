import React, { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import CodeActions from "./actions";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

import { demoScope } from "./demo-scope";

import { cleanCode } from "./clean-code";
import Frame from "./frame";

const ComponentDemo = (props) => {
  const [size, setSize] = useState(100);
  const preCode = require(`!!raw-loader!pages/preview/${props.path}`).default;
  const postCode = cleanCode(preCode, props.path);

  const codeEditor = useDisclosure();

  const [code, setCode] = useState(postCode);

  const resetDemo = () => setCode(postCode);

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(postCode !== code);
  }, [props.path]);

  const editorProps = { codeEditor, preCode, code, resetDemo, isDirty };
  const frameProps = { ...props, size, setSize, code };

  return (
    <React.Fragment key={props.path}>
      <LiveProvider
        scope={{ ...demoScope, ...(props.scope && props.scope) }}
        code={code}
      >
        <Box
          pos="relative"
          minH={props.height || "500px"}
          py={3}
          overflow="auto"
        >
          <Slider
            display={["none", null, "block"]}
            aria-label="Responsive slider"
            colorScheme="brand"
            defaultValue={size}
            maxW="99%"
            step={0.01}
            min={30}
            onChange={(v) => setSize(v)}
          >
            <SliderTrack bg="brand.100">
              <SliderFilledTrack bg="brand.100" />
            </SliderTrack>
            <SliderThumb bg="brand.500" roundedLeft={0}>
              <Box color="white" />
            </SliderThumb>
          </Slider>
          <Frame {...frameProps}>
            <LivePreview />
          </Frame>
        </Box>
        <CodeActions {...props} {...editorProps} />
        <Collapse in={codeEditor.isOpen} animateOpacity>
          <Box
            pos="relative"
            shadow="lg"
            bg="brand.900"
            rounded="lg"
            p={2}
            mt={6}
            h={300}
            overflow="auto"
            fontSize="sm"
            resize="vertical"
          >
            <LiveEditor onChange={(c) => setCode(c)} />
          </Box>
        </Collapse>
        <Box
          _empty={{ display: "none" }}
          bg="red.600"
          roundedBottom="lg"
          py={2}
          px={5}
          fontSize="xs"
        >
          <LiveError />
        </Box>
      </LiveProvider>
    </React.Fragment>
  );
};

export default ComponentDemo;