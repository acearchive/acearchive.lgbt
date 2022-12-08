import React from "react";
import { iconSpritePath } from "@params";

const Icon = ({
  name,
  width,
  height,
  fill,
}: {
  name: string;
  width: string;
  height: string;
  fill?: string;
}) => (
  <svg width={width} height={height} fill={fill ?? "currentColor"}>
    <use xlinkHref={`${iconSpritePath}#${name}`}></use>
  </svg>
);

export const TrashIcon = () => <Icon name="trash" width="24" height="24" />;

export const PlusSquare = () => <Icon name="plus-square" width="20" height="20" />;
