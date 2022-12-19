import React from "react";
import {Box, Button, Text} from "grommet";

export const SidebarButton = ({ label, ...rest }) => (
    <Button plain {...rest}>
        {({ hover }) => (
          <Box
            background={hover ? 'teal' : undefined}
            pad={{ horizontal: 'large', vertical: 'medium' }}
          >
            <Text size="large">{label}</Text>
          </Box>
        )}
  </Button>
);