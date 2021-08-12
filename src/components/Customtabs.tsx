import React from "react";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  appBar: {
    boxShadow: "none",
    borderBottom: "1px solid black",
    backgroundColor: "transparent",
    margin: "auto",
  },
  tabPanel: {
    marginTop: "20px",
  },
  width60: {
    width: "60%",
  },
  width90: {
    width: "90%",
  },
}));

interface CustomTabsProps {
  tabs: {
    label: String;
    content: React.ReactNode;
    disable: boolean;
  }[];
  setTab: String | any;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, setTab }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);

    if (setTab !== "" && newValue === 0) {
      setTab("market");
    } else if (setTab !== "") {
      setTab("limit");
    }
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="default"
        className={clsx(classes.appBar, tabs.length === 2 ? classes.width60 : classes.width90)}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        className={classes.tabPanel}
      >
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index} dir={theme.direction}>
            {tab.content}
          </TabPanel>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default CustomTabs;
