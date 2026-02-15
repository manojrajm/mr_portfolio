import { motion } from "framer-motion";

export const Section = (props) => {
    return (
        <section
            className={`section ${props.right ? "section-right" : "section-left"}`}
            style={{
                opacity: props.opacity,
                flexDirection: props.right ? "row-reverse" : "row",
            }}
        >
            <div className="container">
                {props.children}
            </div>
        </section>
    );
};
