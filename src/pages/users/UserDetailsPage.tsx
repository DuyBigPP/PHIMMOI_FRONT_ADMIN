import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, User } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Trash2, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  UserCheck,
  CreditCard
} from "lucide-react";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) return;
        
        const userData = await api.users.getById(id);
        setUser(userData || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!user || !id) return;
    
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await api.users.delete(id);
        navigate('/users');
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'banned':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSubscriptionContent = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Premium Subscription</span>
          </div>
        );
      case 'basic':
        return (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="font-medium">Basic Subscription</span>
          </div>
        );
      case 'free':
        return (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-muted-foreground">Free Tier</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-muted-foreground">No Subscription</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-muted-foreground">User not found</div>
        <Button onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/users')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-4">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>

            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-4 ${getStatusBadgeClass(user.status)}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
            
            {getSubscriptionContent(user.subscription)}
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-medium text-lg mb-3">Account Information</h3>
            
            <div className="flex items-start gap-3 pb-3 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Registered Date</p>
                <p className="text-sm font-medium">{formatDate(user.registeredDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pb-3 border-b">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-sm font-medium">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pb-3 border-b">
              <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium capitalize">{user.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-medium text-lg">Subscription Details</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {user.subscription === 'premium' 
                  ? 'Premium Plan ($14.99/month)'
                  : user.subscription === 'basic'
                  ? 'Basic Plan ($7.99/month)'
                  : user.subscription === 'free'
                  ? 'Free Plan'
                  : 'No active subscription'
                }
              </span>
            </div>
            
            {user.subscription !== 'none' && (
              <div className="bg-muted p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-2">
                  {user.subscription === 'premium' && (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Full library access - all movies and shows</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>4K Ultra HD streaming</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Watch on 4 devices simultaneously</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Offline downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Ad-free experience</span>
                      </li>
                    </>
                  )}
                  {user.subscription === 'basic' && (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Access to most movies and shows</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>HD streaming</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Watch on 2 devices simultaneously</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-muted-foreground">No offline downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Limited ads</span>
                      </li>
                    </>
                  )}
                  {user.subscription === 'free' && (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Limited library access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>SD streaming</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Watch on 1 device at a time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-muted-foreground">No offline downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-muted-foreground">Ad-supported</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-medium text-lg">Viewing History</h3>
            <p className="text-muted-foreground">Most recent activity shown first</p>
            
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Content</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Date Watched</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2 text-sm">Inception</td>
                      <td className="px-4 py-2 text-sm">Movie</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">Today, 12:30 PM</td>
                      <td className="px-4 py-2 text-sm">148 min</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">The Dark Knight</td>
                      <td className="px-4 py-2 text-sm">Movie</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">Yesterday, 8:45 PM</td>
                      <td className="px-4 py-2 text-sm">152 min</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">Pulp Fiction</td>
                      <td className="px-4 py-2 text-sm">Movie</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">3 days ago</td>
                      <td className="px-4 py-2 text-sm">154 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 