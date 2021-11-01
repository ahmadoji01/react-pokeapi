import Swal from "sweetalert2";

export const raiseErrorAlert = function(status, message) {
    if (status.toLowerCase() === "error") {
        Swal.fire("Oops! Something went wrong", message, "error");
        return;
    }
}