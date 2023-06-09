import React from "react";
import styled from "styled-components";

const CardFooter = styled.div.attrs({ className: "card-footer" })``;

const CardBody = styled.div.attrs({ className: "card-body" })``;

function CardHeader({ children, className, ...props }) {
  return (
    <div
      style={props.style}
      className={`card-header ${className ? className : ""}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ title }) {
  return <h3 className="card-title">{title}</h3>;
}

function CardTools({ children }) {
  return <div className="card-tools">{children}</div>;
}

Card.Body = CardBody;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Tools = CardTools;
Card.Footer = CardFooter;

export default function Card({
  children,
  className,
  isCollapsed,
  style,
  ...props
}) {
  return (
    <div
      style={style}
      className={`card ${isCollapsed ? "collapsed-card" : ""} ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}
