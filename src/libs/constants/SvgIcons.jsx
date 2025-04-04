import { Svg_Feed } from "@assets/svgs/Svg_Feed";
import { Svg_Error } from "@assets/svgs/Svg_Error";
import { Svg_Saved } from "@assets/svgs/Svg_Saved";
import { Svg_Reel } from "@assets/svgs/Svg_Reel";

export const SvgIcons = {
    FEED: (props) => <Svg_Feed {...props} />,
    REEL: (props) => <Svg_Reel {...props} />,
    SAVED: (props) => <Svg_Saved {...props} />,
    ERROR: (props) => <Svg_Error {...props} />,
}