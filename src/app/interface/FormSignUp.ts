import { FormControl } from "@angular/forms";

export interface FormSignUp {
    email: FormControl<String | null >;
    password: FormControl<String | null >;
    nombre: FormControl<String | null >;
    confirmPassword: FormControl<String | null >;
}
