    ChatGPT: Got it! Please provide an informal bug note, and I’ll convert it into a structured bug ticket using the format you specified.

***Context menu is covered by the dropdown menu in Firefox***

ChatGPT:

Title: Context Menu Overlapped by Dropdown Menu in Firefox

Description:
When using the application in Firefox, the context menu is partially or fully obscured by a dropdown menu, making it difficult or impossible to interact with context menu options.

Steps to Reproduce:

    Open the application in the Firefox browser.

    Navigate to a section where both a context menu and a dropdown menu can be triggered.

    Trigger the dropdown menu (e.g., click on a dropdown icon).

    Right-click to open the context menu near or underneath the dropdown.

    Observe the z-index stacking behavior.

Expected vs Actual Behavior:

    Expected: The context menu should appear on top of other UI elements, including dropdown menus, to ensure full visibility and interaction.

    Actual: The dropdown menu appears on top of the context menu, covering it and preventing interaction.

Environment (if known):

    Browser: Firefox

    OS: [Not specified]

    App Version: [Not specified]

Severity or Impact:
Minor – This issue affects user experience by hindering access to the context menu, but does not block core functionality. It may cause frustration or inefficiency in workflows that rely on right-click options.