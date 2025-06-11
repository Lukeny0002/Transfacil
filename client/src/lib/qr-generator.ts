// Simple QR code generator using SVG
export function generateQRCode(data: string): string {
  // This is a simplified QR code representation
  // In a real app, you'd use a proper QR code library like 'qrcode'
  
  const size = 200;
  const moduleSize = size / 25; // 25x25 grid
  
  // Generate a pseudo-random pattern based on the data
  const pattern = [];
  for (let i = 0; i < 25; i++) {
    pattern[i] = [];
    for (let j = 0; j < 25; j++) {
      // Use data to generate consistent pattern
      const hash = data.charCodeAt((i * 25 + j) % data.length);
      pattern[i][j] = (hash + i + j) % 2 === 0;
    }
  }
  
  // Add finder patterns (corners)
  const addFinderPattern = (startRow: number, startCol: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          (i === 0 || i === 6) ||
          (j === 0 || j === 6) ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          pattern[startRow + i][startCol + j] = true;
        } else {
          pattern[startRow + i][startCol + j] = false;
        }
      }
    }
  };
  
  // Add finder patterns
  addFinderPattern(0, 0);    // Top-left
  addFinderPattern(0, 18);   // Top-right
  addFinderPattern(18, 0);   // Bottom-left
  
  // Generate SVG
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;
  
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if (pattern[i][j]) {
        const x = j * moduleSize;
        const y = i * moduleSize;
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}
