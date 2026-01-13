// Export legacy components for backward compatibility
const VLCPlayerLegacy = require('./VLCPlayer').default;
const VlCPlayerView = require('./playerView/index').default;

// Try to export new architecture components, fallback to legacy if not available
let VLCPlayer;
try {
  // Try to import the new TypeScript component
  VLCPlayer = require('./src/VLCPlayer').default;
} catch (e) {
  // Fallback to legacy component if new architecture is not available
  VLCPlayer = VLCPlayerLegacy;
}

// Export both for flexibility
module.exports = {
  VLCPlayer,
  VLCPlayerLegacy,
  VlCPlayerView,
  // Alias for backward compatibility
  default: VLCPlayer,
};