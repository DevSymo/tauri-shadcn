"use client"
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"


import { Sidebar } from "./components/sidebar"
import { listenNowAlbums, madeForYouAlbums } from "./data/albums"
import { playlists } from "./data/playlists"
import "./styles.css"
import Image from "next/image"
import { PlusCircle } from "lucide-react"
import { GearIcon } from '@radix-ui/react-icons';
import { CodeViewer } from './components/code-viewer';


import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function ApiPage() {
  const [getUrl, setGetUrl] = useState('');
  const [getResponse, setGetResponse] = useState('');
  const [useHeaders, setUseHeaders] = useState(false);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);

  type RequestOptions = {
    url: string;
    headers?: Record<string, string>;
  };

  const handleSwitchChange = (newCheckedState) => {
    setUseHeaders(newCheckedState);
  };
  
  const handleGetRequest = async () => {
    try {
      let requestOptions: RequestOptions = { url: getUrl };
      if (useHeaders) {
        const collectedHeaders = headers.reduce((acc, header) => {
          if (header.key && header.value) {
            acc[header.key] = header.value;
          }
          return acc;
        }, {});
  
        if (Object.keys(collectedHeaders).length > 0) {
          requestOptions.headers = collectedHeaders;
        }
      }
  
      const response = await invoke<string>('get_request', requestOptions);
      setGetResponse(response);
    } catch (error) {
      console.error('Error invoking get_request:', error);
      setGetResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const handleHeaderChange = (index, key, value) => {
    const updatedHeaders = headers.map((header, i) => 
      i === index ? { key, value } : header
    );
  
    // If the last header pair is filled out, add a new empty pair
    if (index === headers.length - 1 && key && value) {
      setHeaders([...updatedHeaders, { key: '', value: '' }]);
    } else {
      setHeaders(updatedHeaders);
    }
  };

  const formattedResponse = getResponse ? JSON.stringify(JSON.parse(getResponse), null, 2) : '';
  

  return (
    <div>
      {/* <Menu /> */}
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar playlists={playlists} className="hidden lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="space-between flex items-center">
                  <TabsList>
                    <TabsTrigger value="music" className="relative">GET</TabsTrigger>
                    <TabsTrigger value="podcasts">POST</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto mr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <GearIcon className="mr-2 h-4 w-4" />
                        Options
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Advanced Options</DialogTitle>
                        <DialogDescription>
                          Adjust Queries, Params and Headers here.
                        </DialogDescription>
                      </DialogHeader>
                        <div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={useHeaders}
                                onCheckedChange={handleSwitchChange}
                              />
                              <Label htmlFor="use-headers">Headers</Label>
                            </div>
                            {useHeaders &&
                              headers.map((header, index) => (
                                <div key={index} className="flex items-center space-x-2 my-2">
                                  <Input
                                    type="text"
                                    value={header.key}
                                    placeholder="Header Key"
                                    onChange={(e) => handleHeaderChange(index, e.target.value, header.value)}
                                    className="flex-1"
                                  />
                                  <span>:</span>
                                  <Input
                                    type="text"
                                    value={header.value}
                                    placeholder="Header Value"
                                    onChange={(e) => handleHeaderChange(index, header.key, e.target.value)}
                                    className="flex-1"
                                  />
                                </div>
                              ))
                            }
                          </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                    
                  </div>
                </div>
                <TabsContent
                  value="music"
                  className="border-none p-0 outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Make a Request
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Top picks for you. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                <div className="mt-6 space-y-1">
                  <div className="mt-6 flex space-x-1">
                    <Input id="getUrl" placeholder="Enter your GET endpoint" onChange={(e) => setGetUrl(e.target.value)}/>
                    <Button onClick={handleGetRequest}>Send</Button>
                  </div>
                  <div>
                    <Textarea className="w-full mt-4 p-2 border" rows={6} readOnly value={formattedResponse} />
                    {/*<CodeViewer code={formattedResponse} />*/}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}