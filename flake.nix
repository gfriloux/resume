{
  description = "Dev shell for gfriloux/resume — Astro + GSAP + Three.js";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          name = "resume-dev";

          packages = with pkgs; [
            nodejs_22  # LTS, Astro 4 requires Node 18+, npm bundled
          ];

          shellHook = ''
            echo "resume dev shell — node $(node --version), npm $(npm --version)"
          '';
        };
      }
    );
}
