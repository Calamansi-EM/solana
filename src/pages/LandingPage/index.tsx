import React from "react";
import { History } from "history";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import YouTubeIcon from "@material-ui/icons/YouTube";
import TwitterIcon from "@material-ui/icons/Twitter";
import NearMeIcon from "@material-ui/icons/NearMe";
import FacebookIcon from "@material-ui/icons/Facebook";

import GroupPng from "./../../assets/images/Group.png";
import GroupPngMed from "./../../assets/images/Group-feature.png";
import GroupPngSm from "./../../assets/images/Group_sm.png";
import Logo from "./../../assets/images/logo.svg";
import LogoF from "./../../assets/images/logo-footer.svg";

import CustomTabs from "../../components/Customtabs";

import "./style.css";
import { Hidden } from "@material-ui/core";

interface LandingPageProps {
  history: History;
}

const LandingPage: React.FunctionComponent<LandingPageProps> = ({ history }) => {
  const howWorksTabContentInvestor = (
    <>
      <Grid container justify="flex-end" alignItems="stretch">
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box">
              <p>
                <b style={{ fontSize: "32px" }}>1</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Connect your Solana wallet</b>
              </p>
            </div>
            <p>Use USDC/USDT/BTC... available in your wallet. </p>
          </div>
        </Grid>
        <Hidden xsDown mdDown>
          <Grid item sm={2} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
        </Hidden>
      </Grid>
      <Grid container justify="flex-start" alignItems="stretch" style={{ marginTop: "20px" }}>
        <Hidden xsDown mdDown>
          <Grid item xs={1} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
          <Grid item xs={2} />
        </Hidden>
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box" style={{ backgroundColor: "#755FE2" }}>
              <p>
                <b style={{ fontSize: "32px" }}>2</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Find your ideal investment product</b>
              </p>
            </div>
            <p>
              Exotic offer multitude products reflecting different risk / reward profile. Our assistant is here to help
              you choose the best one for you.{" "}
            </p>
          </div>
        </Grid>
      </Grid>
      <Grid container justify="flex-end" alignItems="stretch" style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box" style={{ backgroundColor: "#FF974A" }}>
              <p>
                <b style={{ fontSize: "32px" }}>3</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Place order during subscription period</b>
              </p>
            </div>
            <p>Our unique AMM provides you liquidity both ways during the subscription period. </p>
          </div>
        </Grid>
        <Hidden xsDown mdDown>
          <Grid item xs={2} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
        </Hidden>
      </Grid>
      <Grid container justify="flex-start" alignItems="stretch" style={{ marginTop: "20px" }}>
        <Hidden xsDown mdDown>
          <Grid item xs={1} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
          <Grid item xs={2} />
        </Hidden>
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box" style={{ backgroundColor: "#755FE2" }}>
              <p>
                <b style={{ fontSize: "32px" }}>4</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Redeem your gain</b>
              </p>
            </div>
            <p>At the product expiry, our settlement engine fully decentralized will calculate the payout. </p>
          </div>
        </Grid>
      </Grid>
    </>
  );
  const howWorksTabContentLiquidityProvider = (
    <>
      <Grid container justify="flex-end" alignItems="stretch">
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box">
              <p>
                <b style={{ fontSize: "32px" }}>1</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Connect your Solana wallet</b>
              </p>
            </div>
            <p>Use USDC/USDT/BTC... available in your wallet. </p>
          </div>
        </Grid>
        <Hidden xsDown mdDown>
          <Grid item sm={2} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
        </Hidden>
      </Grid>
      <Grid container justify="flex-start" alignItems="stretch" style={{ marginTop: "20px" }}>
        <Hidden xsDown mdDown>
          <Grid item xs={1} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
          <Grid item xs={2} />
        </Hidden>
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box" style={{ backgroundColor: "#755FE2" }}>
              <p>
                <b style={{ fontSize: "32px" }}>2</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Provide liquidity</b>
              </p>
            </div>
            <p>Search among our different liquidity pools the one that match your criteria</p>
          </div>
        </Grid>
      </Grid>
      <Grid container justify="flex-end" alignItems="stretch" style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={5}>
          <div className="name-step">
            <div className="num-box" style={{ backgroundColor: "#FF974A" }}>
              <p>
                <b style={{ fontSize: "32px" }}>3</b>
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  marginTop: "0",
                  lineHeight: "75px",
                }}
              >
                <b>Redeem profits</b>
              </p>
            </div>
            <p>Retrieve your portion of trading fees and protocol incentives. </p>
          </div>
        </Grid>
        <Hidden xsDown mdDown>
          <Grid item xs={2} />
          <Grid item className="pic-box">
            <img src={GroupPngMed} alt=" "></img>
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
  const faqTabContent = (
    <>
      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>1. What is exotic markets?</b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              We decided to bring wealth management and structured products out of the bank and in the decentralized
              finance world. If you want to grow your wealth on crypto, exotic is here to help you do it.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>2. What are structured products?</b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              As said by Wikipedia: "A structured product, also known as a market-linked investment, is a pre-packaged
              structured finance investment strategy based on a single security, a basket of securities, options,
              indices, commodities, debt issuance or foreign currencies, and to a lesser extent, derivatives.”
              Basically, it’s financial product to help you grow your wealth by fine tuning the yield vs risk.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>3. What is the difference with other option trading protocol? </b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              While most of today's protocols are destined to traders that understand the market (or at least should),
              Exotic markets provide product that are simple to understand so anyone who want to play on the market
              fully understands the risk and rewards associated to the products.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>4. How can I find a product that corresponds to my vision of the market?</b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              We created an assistant to guide you through available products. Do you think bitcoin will go up in 6
              months? You see a correlation between Ether and Sol? You have the feeling that the market will stay stable
              for the next 3 months? We will provide you with products that correspond to your sentiment so you can
              choose what fits you.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>5. Why on Solana?</b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              Solana is the fastest and cheapest blockchain today. We want you to be able to invest in structured
              products for as low as 1$ and see the result of your transaction right away.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>6. Does Exotic have a token? What does it do? </b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              Yes, there will be a token called EXOM! EXOM will be a governance token capped at 100M total supply.
              Exotic Markets will be governed by EXOM token holders. They will be fully in charge of whitelisting new
              structured products and adjust protocol parameters (fees, rate of buy back and burn). You can stake EXOM
              token to get trading fees reduction and a token incentive.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className="faq-heading">
            <span style={{ fontSize: "20px" }}>
              <b>7. Who is behind Exotic? </b>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span style={{ fontSize: "16px" }}>
              Exotic is a DAO. We want to bring private banking and structured products to everyone. We are starting the
              protocol but it should be managed by the community. EXOM token holders are in charge of the protocol.
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );

  const howWorksTabs = [
    {
      label: "Investor",
      content: howWorksTabContentInvestor,
      disable: false,
    },
    {
      label: "Liquidity Provider",
      content: howWorksTabContentLiquidityProvider,
      disable: false,
    },
  ];
  const faqTabs = [
    {
      label: "Why Exotic?",
      content: faqTabContent,
      disable: false,
    },
  ];

  const onEnterApp = () => {
    history.push("/page/position");
  };

  return (
    <div className="landing">
      <div className="landing-section">
        <div className="logo-div">
          <img src={Logo} alt="Logo" style={{ width: "94px", height: "25px", color: "white" }}></img>
          <Button className="enter-btn2" variant="contained" onClick={onEnterApp}>
            Enter App
            <ArrowForwardIcon fontSize="default" />
          </Button>
        </div>
        <Grid container spacing={2}>
          <Grid xs={1} item={true} />
          <Grid xs={12} sm={4} item={true}>
            <div className="greeting-container">
              <p style={{ fontSize: "64px" }}>
                <b>Your on-chain private banking</b>
              </p>
              <p style={{ fontSize: "20px" }}>Bringing the power of structured products to everyone.</p>
            </div>

            <Button className="enter-btn1" variant="contained" style={{ float: "left" }} onClick={onEnterApp}>
              Enter App
              <ArrowForwardIcon fontSize="default" />
            </Button>
          </Grid>
          <Grid xs={12} sm={6} item={true}>
            <img src={GroupPng} id="pin-img" alt=" "></img>
          </Grid>
          <Grid xs={1} item={true} />
        </Grid>
      </div>

      <div className="feature-section">
        <p style={{ fontSize: "32px" }}>
          <b>Key features</b>
        </p>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4} item={true}>
            <div>
              <div className="feature-circle feature1">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature1-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Private banking on-chain</b>
                </p>
                <p>Be the master of your ideal risk-reward profile with fully customized structured products.</p>
                <br></br>
              </div>
              <div style={{ marginTop: "10px" }}></div>
              <div className="feature-circle feature1">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature1-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Investment Assistant </b>
                </p>
                <p>Get help choosing the most suitable investment product by answering a few simple questions. </p>
              </div>
            </div>
          </Grid>
          <Grid xs={12} sm={6} md={4} item={true}>
            <div>
              <div className="feature-circle feature2">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature2-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Exotic Auction AMM</b>
                </p>
                <p>
                  Decide to buy or sell with market order or limit order during the auction time. Exotic unique AMM will
                  provide you with liquidity both ways.{" "}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <div className="feature-circle feature2">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature2-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Liquidity Pools</b>
                </p>
                <p>Provide liquidity to the protocol and earn part of the trading fees as well as incentives. </p>
              </div>
            </div>
          </Grid>
          <Grid xs={12} sm={6} md={4} item={true}>
            <div>
              <div className="feature-circle feature3">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature3-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Solana, the fastest chain </b>
                </p>
                <p>
                  50000 tx/s with avg blocktime of 400ms. Stop asking yourself dozens of seconds to know if your
                  transaction is successful.{" "}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <div className="feature-circle feature3">
                <img src={GroupPngSm} alt=" "></img>
              </div>
              <div className="feature-box feature3-box">
                <p style={{ fontSize: "24px" }}>
                  <b>Private banking for all</b>
                </p>
                <p>
                  Solana transaction fees (0.0025$) is so low that Exotic allows everyone to enjoy private banking
                  services.{" "}
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="how-work-section">
        <p style={{ fontSize: "32px" }}>
          <b>How it works?</b>
        </p>
        <CustomTabs tabs={howWorksTabs} setTab="" />
      </div>

      <div className="faq-section">
        <p style={{ fontSize: "32px" }}>
          <b>Frequently asked Questions</b>
        </p>
        <CustomTabs tabs={faqTabs} setTab="" />
      </div>

      <div className="community-section">
        <p style={{ fontSize: "32px" }}>
          <b>Join the Community</b>
        </p>
        <p style={{ fontSize: "20px" }}>Learn more about Exotic, receive updates and chat with the team.</p>
        <div style={{ display: "flex", width: "60%", margin: "auto" }}>
          <Grid container spacing={2}>
            <Grid md={1} item={true} />
            <Grid xs={4} sm={4} md={2} item={true}>
              <div className="icon-box">
                <NearMeIcon />
              </div>
            </Grid>
            <Grid xs={4} sm={4} md={2} item={true}>
              <div className="icon-box">
                <TwitterIcon />
              </div>
            </Grid>
            <Grid xs={4} sm={4} md={2} item={true}>
              <div className="icon-box">
                <YouTubeIcon />
              </div>
            </Grid>
            <Grid xs={6} sm={6} md={2} item={true}>
              <div className="icon-box">
                <NearMeIcon />
              </div>
            </Grid>
            <Grid xs={6} sm={6} md={2} item={true}>
              <div className="icon-box">
                <FacebookIcon />
              </div>
            </Grid>
            <Grid md={1} item={true} />
          </Grid>
        </div>
      </div>

      <div className="footer">
        <div className="footer-content-div">
          <Grid container spacing={2}>
            <Grid xs={12} sm={4} item={true}>
              <img src={LogoF} alt="Logo" style={{ width: "180px", height: "48px" }}></img>
              <p style={{ fontSize: "16px" }}>Buy & Sell crypto safely with your local currency.</p>
              <div>
                <NearMeIcon style={{ color: "#00459D", marginLeft: "15px" }} />
                <TwitterIcon style={{ color: "#00459D", marginLeft: "15px" }} />
                <YouTubeIcon style={{ color: "#00459D", marginLeft: "15px" }} />
              </div>
            </Grid>
            <Grid xs={12} sm={2} item={true}>
              <p className="footer-title">
                <b>Platform</b>
              </p>
              <p>My Positions</p>
              <p>Invest</p>
              <p>Pool</p>
              <p>Retrieve token</p>
            </Grid>
            <Grid xs={12} sm={2} item={true}>
              <p className="footer-title">
                <b>Support</b>
              </p>
              <p>Guides</p>
              <p>FAQ</p>
              <p>Forum</p>
              <p>Contact</p>
              <p>Fees</p>
            </Grid>
            <Grid xs={12} sm={2} item={true}>
              <p className="footer-title">
                <b>Legal</b>
              </p>
              <p>Terms of Use</p>
              <p>Privacy Policy</p>
              <p>Security Audit</p>
            </Grid>
            <Grid xs={12} sm={2} item={true}>
              <p className="footer-title">
                <b>About</b>
              </p>
              <p>Whitepaper</p>
              <p>Github</p>
            </Grid>
          </Grid>
        </div>
        <div>
          <p>© 2021 - 2022 exotic.markets. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
