# OpenVPN Exposure and Firewall Checklist

This document outlines the steps required to configure OpenVPN exposure and the necessary firewall port-forwards for the `freedom-label` system.

## OpenVPN Configuration

The release workflow assumes a TCP 1194 tunnel. You can use PiVPN for server mode or maintain a `.ovpn` profile for client mode.

### PiVPN (Server Mode)

If using PiVPN, ensure it is configured to listen on TCP port 1194.

### Client Mode (`.ovpn` profile)

If using client mode, ensure your `.ovpn` profile is correctly configured to connect to your OpenVPN server. If a split-tunnel is needed, add `route-nopull` to your `.ovpn` file.

## Firewall Port-Forward Checklist

To allow external access to the `freedom-label` services through your network, you will need to configure port forwarding on your router or firewall. The following ports need to be forwarded:

-   **TCP 1194 (OpenVPN):** This port is required for the OpenVPN tunnel, allowing the GitHub Actions runner to establish an SSH connection to your Raspberry Pi.

-   **TCP 8000 (FastAPI Backend):** This port is used by the FastAPI backend service. If you intend to expose the API directly, you will need to forward this port.

-   **TCP 80 (Nginx Frontend):** This port is used by the Nginx frontend service. If you intend to expose the UI directly, you will need to forward this port.

**Important Considerations:**

-   **Security:** Exposing services directly to the internet carries security risks. Ensure your systems are hardened and up-to-date.
-   **Static IP:** Your Raspberry Pi should have a static IP address on your local network to ensure consistent port forwarding.
-   **Router/Firewall Documentation:** Refer to your router or firewall's documentation for specific instructions on how to configure port forwarding.
