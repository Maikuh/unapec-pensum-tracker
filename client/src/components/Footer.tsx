import React from "react";
import { Divider, Link } from "@material-ui/core";

export const Footer = () => {
    return (
        <div className="footer-container">
            <Divider
                style={{
                    flexGrow: 1,
                    marginBottom: "2em",
                    marginTop: "2em",
                }}
            />

            <footer>
                &copy; Miguel Araujo{" "}
                <Link href="https://github.com/maikuh" target="_blank">
                    GitHub
                </Link>{" "}
                /{" "}
                <Link href="https://gitlab.com/maikuh" target="_blank">
                    GitLab
                </Link>
            </footer>
        </div>
    );
};
