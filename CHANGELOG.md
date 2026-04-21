# Changelog

All notable changes to **Agent Architect** will be documented in this file.

## [0.2.0] - 2026-04-21

### ✨ Added
- **Backdrop Nodes**: New grouping system that allows locking nodes inside a resizable container.
- **Bézier Waypoints**: Added the ability to split edges with a double-click to create custom routing points.
- **Contextual Help Panel**: A dynamic UI element (bottom-right) that provides keyboard shortcuts based on selection.
- **Smart Edge Routing**: Edges now intelligently reverse their visual path when toggled to 'return' mode.
- **Directional Styling**: Automatic color-coding for flow paths (Blue for Forward, Red for Return).
- **Project Context Awareness**: The tool now suggests grouping when multiple nodes are selected via Marquee.

### 🔧 Fixed
- **Grouping Offset**: Fixed a critical bug where nodes would "jump" when added to a parent container.
- **Hierarchy Management**: Corrected the node rendering order to ensure parent backdrops always stay behind their children.
- **Waypoint Deletion**: Added support for deleting Waypoint nodes via the 'Delete' key and a dedicated UI button.

### 🗑️ Removed
- **Legacy Layout Toggle**: Removed the automatic Vertical/Horizontal layout system in favor of free-form waypoint routing.
- **Cleanup**: Standardized all Toolbar buttons and removed inconsistent highlight colors.

---
*Built by SOVERIS.*
