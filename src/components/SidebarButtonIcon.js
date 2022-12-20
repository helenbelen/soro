import React from "react";
import {Box, Button} from "grommet";

export const SidebarButtonIcon = ({ label, icon, ...rest }) => (
    <Button plain {...rest}>
        {({ hover }) => (
          <Box
            background={hover ? 'teal' : 'light-3'}
            pad={{ horizontal: 'large', vertical: 'medium' }}
            direction={"row"}
            gap={"small"}
          >
            {icon}
            {label}
          </Box>
        )}
  </Button>
);