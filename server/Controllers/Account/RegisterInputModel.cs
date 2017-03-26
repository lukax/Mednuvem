// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System.ComponentModel.DataAnnotations;

namespace IdentityServer4.Quickstart.UI
{
    public class RegisterInputModel
    {
        [Required(ErrorMessage = "O campo senha é necessário")]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "O campo confirmar senha é necessário")]
        public string ConfirmPassword { get; set; }
        
        [Required(ErrorMessage = "O campo email é necessário")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O campo nome é necessário")]
        public string Name { get; set; }

        [Required(ErrorMessage = "O campo empresa é necessário")]
        public string Company { get; set; }

        [Required(ErrorMessage = "O campo códgo de convite é necessário")]
        public string InvitationCode { get; set; }

        
    }
}