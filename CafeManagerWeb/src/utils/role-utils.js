export function getRoleLabel(role) {

    switch (role) {

        case "admin":
            return "Administrador";

        case "user":
            return "Amante de Café";

        default:
            return role;

    }

}