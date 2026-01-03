import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-black/40 border-t border-white/10 backdrop-blur-md mt-auto py-8 z-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-purple-400">Shady's Business LLC</h3>
                        <p className="text-gray-400 text-sm mb-2">
                            Technology solutions for modern creators.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
                        <p className="text-gray-400 text-sm mb-1">
                            <span className="font-medium text-gray-300">Address:</span><br />
                            30 N Gould St Ste R<br />
                            Sheridan, SHERIDAN COUNTY, WY 82801 USA
                        </p>
                        <p className="text-gray-400 text-sm mb-1 mt-2">
                            <span className="font-medium text-gray-300">Phone:</span> 212766808947
                        </p>
                        <p className="text-gray-400 text-sm">
                            <span className="font-medium text-gray-300">Email:</span> contact@bboymusic.com
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2026 Shady's Business LLC. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
